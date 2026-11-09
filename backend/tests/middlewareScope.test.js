import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { createApp } from "../src/app.js";
import { jsonBody, limitBody } from "../src/middleware/requestBody.js";

const config = {
  origin: "http://localhost:3000",
  production: false,
  jwtSecret: randomBytes(32).toString("hex"),
  mfaEncryptionKey: randomBytes(32).toString("hex"),
};
const app = await createApp({ db: {}, config, clientIp: () => "scope-test" });
// Rutas sintéticas: comprueban aislamiento sin implementar módulos públicos ni subidas.
app.post("/api/v1/probe", ...jsonBody({ maxBytes: 64 * 1024 }), async (c) => {
  const body = await c.req.json();
  return c.json({ length: body.text.length });
});
app.get("/api/v1/probe", (c) => {
  c.header("Cache-Control", "public, max-age=60");
  return c.json({ ok: true });
});
app.post("/api/v1/upload-probe", limitBody(64 * 1024), async (c) => {
  const form = await c.req.formData();
  return c.json({ bytes: form.get("file").size });
});

test("JSON público admite su límite sin cabecera admin ni no-store global", async () => {
  const response = await app.request("/api/v1/probe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "a".repeat(20 * 1024) }),
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).length, 20 * 1024);
  assert.equal(response.headers.get("cache-control"), null);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.ok(response.headers.get("x-request-id"));
  assert.equal(
    (await app.request("/api/v1/probe")).headers.get("cache-control"),
    "public, max-age=60",
  );
});

test("multipart usa límite propio y rechaza archivos que lo superan", async () => {
  for (const [size, expected] of [
    [20 * 1024, 200],
    [70 * 1024, 413],
  ]) {
    const form = new FormData();
    form.set("file", new Blob([new Uint8Array(size)]), "test.pdf");
    const response = await app.request("/api/v1/upload-probe", { method: "POST", body: form });
    assert.equal(response.status, expected);
    if (expected === 200) assert.equal((await response.json()).bytes, size);
  }
});

test("auth mantiene origen, formato, límite y cache privado", async () => {
  const send = (headers, body = "{}") =>
    app.request("/api/v1/auth/login", {
      method: "POST",
      headers,
      body,
    });
  const base = { "Content-Type": "application/json", "X-IPC-Client": "admin" };
  assert.equal((await send({ "Content-Type": "application/json" })).status, 403);
  assert.equal((await send({ ...base, Origin: "https://evil.example" })).status, 403);
  assert.equal((await send({ ...base, "Content-Type": "multipart/form-data" })).status, 415);
  const oversized = await send(base, JSON.stringify({ text: "a".repeat(17 * 1024) }));
  assert.equal(oversized.status, 413);
  assert.equal(oversized.headers.get("cache-control"), "no-store");
  assert.equal((await app.request("/api/v1/auth/me")).status, 401);
});

test("la ruta de demostración retirada responde 404 sin devolver el cuerpo", async () => {
  const response = await app.request("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "dato-de-prueba" }),
  });
  assert.equal(response.status, 404);
  const body = await response.json();
  assert.equal(body.error.code, "NOT_FOUND");
  assert.equal("data" in body, false);
});
