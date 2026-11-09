import assert from "node:assert/strict";
import { createMfaCrypto, createTotp } from "../../src/modules/auth/mfaCrypto.js";

// Solo fixtures: permite probar JWT repetidamente sin esperar ventanas de 30 segundos.
// Las pruebas MFA independientes comprueban el bloqueo real de códigos reutilizados.
export async function finishTestLogin(response, request, db, config, email) {
  assert.equal(response.status, 202);
  const { data } = await response.json();
  const admin = await db.admin.findUnique({ where: { email: email.trim().toLowerCase() } });
  const secret =
    data.secret ?? createMfaCrypto(config.mfaEncryptionKey).decrypt(admin.mfaSecret, admin.id);
  await db.admin.update({ where: { id: admin.id }, data: { mfaLastStep: null } });
  return request("/mfa/verify", {
    challengeToken: data.challengeToken,
    code: createTotp(secret).generate(),
  });
}
