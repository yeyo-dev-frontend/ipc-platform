import { finishTestLogin } from "./helpers/mfaLogin.js";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { test } from "node:test";
import { newToken, digest } from "../src/modules/auth/authCrypto.js";
import { createDatabase } from "../src/infrastructure/database/prisma.js";
import { createAuthRepository } from "../src/modules/auth/authRepository.js";
import { createAuthService } from "../src/modules/auth/authService.js";
import { createApp } from "../src/app.js";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl) throw new Error("Usa pnpm test para seleccionar la base aislada.");
const url = new URL(databaseUrl);
if (
  !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
  url.pathname !== "/ipc_backend_auth_test" ||
  url.search
) {
  throw new Error("Base de pruebas no permitida.");
}

test("Registro y autenticación con PostgreSQL real", async (t) => {
  const db = createDatabase(databaseUrl);
  const password = "Prueba privada " + newToken();
  const repository = createAuthRepository(db);
  const config = {
    origin: "http://localhost:3000",
    production: false,
    jwtSecret: randomBytes(32).toString("hex"),
    mfaEncryptionKey: randomBytes(32).toString("hex"),
  };
  const service = await createAuthService(repository, config);
  const app = await createApp({
    db,
    config,
    clientIp: () => "integration",
  });
  const request = (path, body, session, extra = {}) =>
    app.request("http://localhost:3000/api/v1/auth" + path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-IPC-Client": "admin",
        ...(session
          ? {
              Cookie: session.cookie,
              "X-CSRF-Token": session.csrf,
              Authorization: "Bearer " + session.accessToken,
            }
          : {}),
        ...extra,
      },
      ...(body === undefined
        ? {}
        : { body: typeof body === "string" ? body : JSON.stringify(body) }),
    });
  const login = async (email, old) => {
    const response = await finishTestLogin(
      await request("/login", { email, password }, old),
      request,
      db,
      config,
      email,
    );
    assert.equal(response.status, 200);
    const json = await response.json();
    const cookie = response.headers
      .getSetCookie()
      .find((item) => item.startsWith("ipc_refresh=") && !item.includes("Max-Age=0"));
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Strict/i);
    assert.equal(JSON.stringify(json).includes("passwordHash"), false);
    return {
      cookie: cookie.split(";")[0],
      csrf: json.data.csrfToken,
      admin: json.data.admin,
      accessToken: json.data.accessToken,
    };
  };
  let root, main, admissions, admissionSession, eventSession;
  try {
    // Exclusivamente en ipc_backend_auth_test: datos ficticios de ejecuciones previas.
    await db.session.deleteMany();
    await db.activation.deleteMany();
    await db.auditLog.deleteMany();
    await db.authRateLimit.deleteMany();
    await db.admin.deleteMany();

    await t.test("bootstrap simultáneo: una sola cuenta, sin sobrescritura", async () => {
      const results = await Promise.allSettled([
        service.bootstrap({ name: "Administrador prueba", email: "admin@example.test" }),
        service.bootstrap({ name: "Otro administrador", email: "other@example.test" }),
      ]);
      assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
      root = results.find((r) => r.status === "fulfilled").value;
      assert.equal(await db.admin.count(), 1);
      assert.equal(root.admin.isActive, false);
    });
    await t.test("activación única incluso con peticiones simultáneas", async () => {
      const results = await Promise.all([
        request("/activate", { token: root.activationToken, password }),
        request("/activate", { token: root.activationToken, password }),
      ]);
      assert.deepEqual(results.map((r) => r.status).sort(), [200, 400]);
      const stored = await db.admin.findUnique({ where: { id: root.admin.id } });
      assert.match(stored.passwordHash, /^\$argon2id\$/);
      assert.notEqual(stored.passwordHash, password);
    });
    await t.test("login normaliza email y devuelve cookie más CSRF", async () => {
      main = await login("  " + root.admin.email.toUpperCase() + "  ");
      const session = await db.refreshToken.findFirst();
      assert.notEqual(session.tokenHash, main.cookie.split("=")[1]);
      assert.equal(session.tokenHash.length, 64);
    });
    await t.test("registro exige sesión, rol y CSRF", async () => {
      const body = {
        name: "Admisión prueba",
        email: "admissions@example.test",
        role: "admissions",
      };
      assert.equal((await request("/register", body)).status, 401);
      assert.equal(
        (await request("/register", body, main, { "X-CSRF-Token": "incorrecto" })).status,
        403,
      );
      const response = await request("/register", body, main);
      assert.equal(response.status, 201);
      admissions = (await response.json()).data;
      assert.equal(admissions.admin.isActive, false);
      assert.equal(JSON.stringify(admissions).includes("passwordHash"), false);
      const activation = await db.activation.findUnique({
        where: { tokenHash: digest(admissions.activationToken) },
      });
      assert.ok(activation);
    });
    await t.test("duplicados normalizados y campos no permitidos", async () => {
      const body = { name: "Otra cuenta", email: " ADMISSIONS@EXAMPLE.TEST ", role: "admissions" };
      assert.equal((await request("/register", body, main)).status, 409);
      assert.equal((await request("/register", { ...body, role: "superAdmin" }, main)).status, 422);
      assert.equal((await request("/register", { ...body, isActive: true }, main)).status, 422);
      await assert.rejects(
        db.admin.create({
          data: {
            name: "Bypass",
            email: "UPPER@EXAMPLE.TEST",
            passwordHash: "unused",
            role: "events",
          },
        }),
      );
    });
    await t.test(
      "cuenta pendiente, inexistente y contraseña errónea dan el mismo error",
      async () => {
        const errors = [];
        for (const email of [admissions.admin.email, "missing@example.test", root.admin.email]) {
          const response = await request("/login", { email, password: "incorrect password" });
          assert.equal(response.status, 401);
          errors.push((await response.json()).error);
        }
        assert.deepEqual(errors[0], errors[1]);
        assert.deepEqual(errors[1], errors[2]);
      },
    );
    await t.test("activación rechaza contraseñas cortas y códigos vencidos", async () => {
      assert.equal(
        (await request("/activate", { token: admissions.activationToken, password: "123" })).status,
        422,
      );
      await db.activation.update({
        where: { tokenHash: digest(admissions.activationToken) },
        data: { expiresAt: new Date(0) },
      });
      assert.equal(
        (await request("/activate", { token: admissions.activationToken, password })).status,
        400,
      );
      await db.activation.update({
        where: { tokenHash: digest(admissions.activationToken) },
        data: { expiresAt: new Date(Date.now() + 60000) },
      });
      assert.equal(
        (await request("/activate", { token: admissions.activationToken, password })).status,
        200,
      );
      admissionSession = await login(admissions.admin.email);
    });
    await t.test("admissions y events no pueden registrar cuentas", async () => {
      const body = { name: "Eventos prueba", email: "events@example.test", role: "events" };
      assert.equal((await request("/register", body, admissionSession)).status, 403);
      const invited = (await (await request("/register", body, main)).json()).data;
      assert.equal(
        (await request("/activate", { token: invited.activationToken, password })).status,
        200,
      );
      eventSession = await login(body.email);
      assert.equal((await request("/register", body, eventSession)).status, 403);
    });
    await t.test("me consulta rol actual y rechaza cuenta desactivada", async () => {
      await db.admin.update({ where: { id: admissions.admin.id }, data: { role: "events" } });
      const response = await request("/me", undefined, admissionSession);
      assert.equal((await response.json()).data.admin.role, "events");
      await db.admin.update({ where: { id: admissions.admin.id }, data: { isActive: false } });
      assert.equal((await request("/me", undefined, admissionSession)).status, 401);
    });
    await t.test("origen ajeno, cabecera ausente y formato inválido", async () => {
      const body = { email: root.admin.email, password };
      assert.equal(
        (await request("/login", body, null, { Origin: "https://evil.example" })).status,
        403,
      );
      assert.equal((await request("/login", body, null, { "X-IPC-Client": "" })).status, 403);
      assert.equal(
        (await request("/login", body, null, { "Content-Type": "text/plain" })).status,
        415,
      );
      assert.equal((await request("/login", "{")).status, 400);
      assert.equal(
        (await request("/login", { email: root.admin.email, password: "x".repeat(17000) })).status,
        413,
      );
    });
    await t.test("rotación de sesión invalida cookie previa", async () => {
      const old = main;
      main = await login(root.admin.email, old);
      assert.notEqual(main.cookie, old.cookie);
      assert.equal((await request("/me", undefined, old)).status, 401);
    });
    await t.test("vencimiento por inactividad y absoluto", async () => {
      await db.session.updateMany({
        where: { adminId: eventSession.admin.id },
        data: { lastSeenAt: new Date(Date.now() - 31 * 60_000) },
      });
      assert.equal((await request("/me", undefined, eventSession)).status, 401);
      await db.authRateLimit.deleteMany();
      eventSession = await login(eventSession.admin.email);
      await db.session.updateMany({
        where: { adminId: eventSession.admin.id },
        data: { expiresAt: new Date(0) },
      });
      assert.equal((await request("/me", undefined, eventSession)).status, 401);
    });
    await t.test("logout revoca sesión en la BD y elimina cookie", async () => {
      const response = await request("/logout", {}, main);
      assert.equal(response.status, 204);
      assert.match(response.headers.get("set-cookie"), /Max-Age=0/);
      assert.equal((await request("/me", undefined, main)).status, 401);
    });
    await t.test("límite persistente por cuenta, IP y vencimiento de ventana", async () => {
      await db.authRateLimit.deleteMany();
      for (let i = 0; i < 10; i++) {
        assert.equal(
          (await request("/login", { email: root.admin.email, password: "wrong" })).status,
          401,
        );
      }
      assert.equal((await request("/login", { email: root.admin.email, password })).status, 429);
      await db.authRateLimit.updateMany({ data: { expiresAt: new Date(0) } });
      assert.equal((await request("/login", { email: root.admin.email, password })).status, 202);
      await db.authRateLimit.update({
        where: { key: digest("ip:integration") },
        data: { hits: 30 },
      });
      assert.equal(
        (await request("/login", { email: "another@example.test", password })).status,
        429,
      );
    });
    await t.test(
      "reemisión invalida invitaciones anteriores sin reiniciar cuentas activas",
      async () => {
        await db.authRateLimit.deleteMany();
        main = await login(root.admin.email);
        const body = { name: "Pendiente", email: "pending@example.test", role: "events" };
        const created = (await (await request("/register", body, main)).json()).data;
        assert.equal((await request("/activation/reissue", { email: body.email })).status, 401);
        const response = await request("/activation/reissue", { email: body.email }, main);
        assert.equal(response.status, 200);
        const fresh = (await response.json()).data;
        assert.notEqual(fresh.activationToken, created.activationToken);
        assert.equal(
          (await request("/activate", { token: created.activationToken, password })).status,
          400,
        );
        assert.equal(
          (await request("/activate", { token: fresh.activationToken, password })).status,
          200,
        );
        assert.equal(
          (await request("/activation/reissue", { email: body.email }, main)).status,
          409,
        );
        await assert.rejects(service.reissue(root.admin.email), { code: "ACCOUNT_ACTIVE" });
      },
    );
    await t.test("registro concurrente conserva un único correo", async () => {
      const data = { name: "Concurrente", email: "concurrent@example.test", role: "events" };
      const responses = await Promise.all([
        request("/register", data, main),
        request("/register", data, main),
      ]);
      assert.deepEqual(responses.map((r) => r.status).sort(), [201, 409]);
    });
    await t.test("errores internos no filtran detalles de PostgreSQL", async () => {
      const broken = await createApp({
        db: {
          session: {
            updateMany: () => {
              throw new Error("password=database-secret");
            },
          },
        },
        config,
        clientIp: () => "test",
      });
      const response = await broken.request("/api/v1/auth/me", {
        headers: { Authorization: "Bearer " + main.accessToken },
      });
      assert.equal(response.status, 500);
      assert.equal((await response.text()).includes("database-secret"), false);
    });
    await t.test(
      "auditoría no contiene contraseñas ni tokens y respuestas no se cachean",
      async () => {
        const logs = JSON.stringify(await db.auditLog.findMany());
        assert.equal(logs.includes(password), false);
        assert.equal(logs.includes(root.activationToken), false);
        assert.ok(logs.includes("auth.login"));
        assert.ok(logs.includes("admin.register"));
        assert.equal((await request("/me")).headers.get("cache-control"), "no-store");
      },
    );
  } finally {
    await db.$disconnect();
  }
});
