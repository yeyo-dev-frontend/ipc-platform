import assert from "node:assert/strict";
import { test } from "node:test";
import { createJwtContext } from "./helpers/jwtContext.js";
import { createTotp, createMfaCrypto } from "../src/modules/auth/mfaCrypto.js";
import { digest } from "../src/modules/auth/authCrypto.js";

test("MFA obligatorio con PostgreSQL", async (t) => {
  const ctx = await createJwtContext();
  const begin = async () => {
    const res = await ctx.begin();
    assert.equal(res.status, 202);
    const { data } = await res.json();
    assert.equal(data.accessToken, undefined);
    assert.equal(data.refreshToken, undefined);
    assert.equal(res.headers.get("cache-control"), "no-store");
    return data;
  };
  const verify = (challenge, code) =>
    ctx.request("/mfa/verify", {
      challengeToken: challenge.challengeToken,
      code,
    });
  let setup, session, codes;
  try {
    await t.test("contraseña sola no crea sesión; desafío no autoriza API", async () => {
      setup = await begin();
      assert.equal(setup.enrollmentRequired, true);
      assert.equal(await ctx.db.session.count(), 0);
      assert.equal(
        (await ctx.request("/me", undefined, { accessToken: setup.challengeToken })).status,
        401,
      );
      const stored = await ctx.db.mfaChallenge.findFirst();
      assert.notEqual(stored.pendingSecret, setup.secret);
      assert.equal(stored.tokenHash, digest(setup.challengeToken));
      const crypto = createMfaCrypto(ctx.config.mfaEncryptionKey);
      assert.throws(() => crypto.decrypt(stored.pendingSecret, "wrong-account"));
    });
    await t.test("origen externo y código incorrecto no activan MFA", async () => {
      const response = await ctx.request(
        "/mfa/verify",
        {
          challengeToken: setup.challengeToken,
          code: createTotp(setup.secret).generate(),
        },
        null,
        { Origin: "https://evil.example" },
      );
      assert.equal(response.status, 403);
      assert.equal((await verify(setup, "x".repeat(43))).status, 401);
      assert.equal((await ctx.db.admin.findFirst()).mfaSecret, null);
    });
    await t.test("enrolamiento concurrente crea una sola sesión y códigos privados", async () => {
      const code = createTotp(setup.secret).generate();
      const results = await Promise.all([verify(setup, code), verify(setup, code)]);
      assert.deepEqual(results.map((r) => r.status).sort(), [200, 401]);
      session = await ctx.read(results.find((r) => r.status === 200));
      codes = session.recoveryCodes;
      assert.equal(codes.length, 10);
      assert.equal(await ctx.db.session.count(), 1);
      assert.equal(await ctx.db.recoveryCode.count(), 10);
      assert.equal(
        (await ctx.db.recoveryCode.findMany()).some((r) => codes.includes(r.tokenHash)),
        false,
      );
      assert.equal((await ctx.request("/me", undefined, session)).status, 200);
    });
    await t.test("código TOTP ya usado no funciona con otro desafío", async () => {
      const challenge = await begin();
      assert.equal(challenge.secret, undefined);
      assert.equal(challenge.enrollmentRequired, false);
      const admin = await ctx.db.admin.findFirst();
      const usedCode = createTotp(setup.secret).generate({ timestamp: admin.mfaLastStep * 30000 });
      assert.equal((await verify(challenge, usedCode)).status, 401);
    });
    await t.test("recuperación de un solo uso revoca sesiones anteriores", async () => {
      const challenge = await begin();
      const results = await Promise.all([verify(challenge, codes[0]), verify(challenge, codes[0])]);
      assert.deepEqual(results.map((r) => r.status).sort(), [200, 401]);
      assert.equal(await ctx.db.recoveryCode.count(), 9);
      assert.equal((await ctx.request("/me", undefined, session)).status, 401);
      assert.equal((await verify(await begin(), codes[0])).status, 401);
    });
    await t.test("desafío vencido y cuenta desactivada no consumen códigos", async () => {
      const challenge = await begin();
      await ctx.db.mfaChallenge.update({
        where: { tokenHash: digest(challenge.challengeToken) },
        data: { expiresAt: new Date(0) },
      });
      assert.equal((await verify(challenge, codes[1])).status, 401);
      const next = await begin();
      await ctx.db.admin.updateMany({ data: { isActive: false } });
      assert.equal((await verify(next, codes[1])).status, 401);
      assert.equal(await ctx.db.recoveryCode.count(), 9);
      await ctx.db.admin.updateMany({ data: { isActive: true } });
    });
    await t.test("cinco intentos fallidos bloquean el desafío", async () => {
      await ctx.db.authRateLimit.deleteMany();
      const challenge = await begin();
      for (let i = 0; i < 5; i++)
        assert.equal((await verify(challenge, "x".repeat(43))).status, 401);
      assert.equal((await verify(challenge, codes[1])).status, 429);
      assert.equal(await ctx.db.recoveryCode.count(), 9);
    });
  } finally {
    await ctx.db.$disconnect();
  }
});
