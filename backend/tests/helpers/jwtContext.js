import { finishTestLogin } from "./mfaLogin.js";
import assert from "node:assert/strict";
import { randomBytes, randomUUID, createSecretKey } from "node:crypto";
import { SignJWT, decodeJwt } from "jose";
import { createDatabase } from "../../src/infrastructure/database/prisma.js";
import { createApp } from "../../src/app.js";
import { createAuthRepository } from "../../src/modules/auth/authRepository.js";
import { createInvitationService } from "../../src/modules/auth/invitationService.js";

export async function createJwtContext() {
  const url = new URL(process.env.TEST_DATABASE_URL);
  if (
    url.pathname !== "/ipc_backend_auth_test" ||
    url.search ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  )
    throw new Error("Base no permitida");
  const db = createDatabase(url.href);
  const config = {
    origin: "http://localhost:3000",
    production: false,
    jwtSecret: randomBytes(32).toString("hex"),
    mfaEncryptionKey: randomBytes(32).toString("hex"),
  };
  const app = await createApp({ db, config, clientIp: () => "jwt-tests" });
  await db.session.deleteMany();
  await db.activation.deleteMany();
  await db.auditLog.deleteMany();
  await db.authRateLimit.deleteMany();
  await db.admin.deleteMany();
  const invitations = createInvitationService(createAuthRepository(db));
  const account = await invitations.bootstrap({ name: "JWT Test", email: "jwt@example.test" });
  const password = randomBytes(24).toString("hex");
  await invitations.activate({ token: account.activationToken, password }, "test");
  const request = (path, body, session, extra = {}) =>
    app.request("/api/v1/auth" + path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-IPC-Client": "admin",
        ...(session?.accessToken ? { Authorization: "Bearer " + session.accessToken } : {}),
        ...(session?.cookie ? { Cookie: session.cookie } : {}),
        ...(session?.csrf ? { "X-CSRF-Token": session.csrf } : {}),
        ...extra,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  const read = async (response) => {
    assert.equal(response.status, 200);
    const { data } = await response.json();
    assert.equal("refreshToken" in data, false);
    const cookie = response.headers
      .getSetCookie()
      .find((value) => value.startsWith("ipc_refresh=") && !value.includes("Max-Age=0"));
    return { ...data, cookie: cookie?.split(";")[0], csrf: data.csrfToken };
  };
  return {
    db,
    config,
    request,
    read,
    async begin() {
      return request("/login", { email: account.admin.email, password });
    },
    async login() {
      return read(
        await finishTestLogin(
          await request("/login", { email: account.admin.email, password }),
          request,
          db,
          config,
          account.admin.email,
        ),
      );
    },
    async fresh() {
      await db.session.deleteMany();
      await db.authRateLimit.deleteMany();
    },
    async sign(session, changes = {}, header = {}) {
      const now = Math.floor(Date.now() / 1000);
      const original = decodeJwt(session.accessToken);
      return new SignJWT({ ...original, jti: randomUUID(), iat: now, exp: now + 600, ...changes })
        .setProtectedHeader({ alg: "HS256", typ: "at+jwt", ...header })
        .sign(createSecretKey(Buffer.from(config.jwtSecret, "hex")));
    },
  };
}
