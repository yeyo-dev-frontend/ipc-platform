import { digest, newToken } from "./authCrypto.js";
import { createMfaCrypto, createTotp } from "./mfaCrypto.js";
import { AppError } from "../../middleware/errors.js";

export function createMfaService(repository, tokens, config) {
  const crypto = createMfaCrypto(config.mfaEncryptionKey);
  return {
    async beginMfa(admin, previousToken) {
      const challengeToken = newToken();
      const secret = admin.mfaSecret ? null : crypto.generate();
      await repository.createChallenge({
        tokenHash: digest(challengeToken),
        adminId: admin.id,
        passwordVersion: digest(admin.passwordHash),
        pendingSecret: secret ? crypto.encrypt(secret, admin.id) : null,
        oldHash: previousToken ? digest(previousToken) : null,
        expiresAt: new Date(Date.now() + 5 * 60_000),
      });
      return {
        mfaRequired: true,
        enrollmentRequired: !!secret,
        challengeToken,
        expiresIn: 300,
        ...(secret ? { secret, provisioningUri: createTotp(secret, admin.email).toString() } : {}),
      };
    },
    async completeMfa(data, requestId) {
      const hash = digest(data.challengeToken);
      await repository.limit(digest("mfa-challenge:" + hash), 5, 5 * 60_000);
      const challenge = await repository.findChallenge(hash);
      if (!challenge) throw new AppError(401, "INVALID_MFA", "Código o desafío inválido.");
      await repository.limit(digest("mfa-account:" + challenge.adminId), 10, 15 * 60_000);
      const refreshToken = newToken();
      const recoveryCodes = Array.from({ length: 10 }, () => newToken());
      const result = await repository.completeMfa(
        hash,
        data.code,
        crypto,
        recoveryCodes.map(digest),
        digest(refreshToken),
        requestId,
      );
      if (!result) throw new AppError(401, "INVALID_MFA", "Código o desafío inválido o vencido.");
      return {
        ...(await tokens.issue(result.session)),
        refreshToken,
        admin: result.session.admin,
        csrfToken: tokens.csrf(result.session.id),
        sessionExpiresAt: result.session.expiresAt,
        ...(result.enrolled ? { recoveryCodes } : {}),
      };
    },
  };
}
