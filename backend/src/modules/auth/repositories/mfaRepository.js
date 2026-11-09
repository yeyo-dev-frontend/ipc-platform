import { digest } from "../authCrypto.js";
import { createSessionRepository } from "./sessionRepository.js";
import { recordAudit } from "../../audit/auditRepository.js";

export function createMfaRepository(db) {
  return {
    createChallenge: (data) => db.mfaChallenge.create({ data }),
    findChallenge: (tokenHash) => db.mfaChallenge.findUnique({ where: { tokenHash } }),
    async completeMfa(tokenHash, code, crypto, recoveryHashes, refreshHash, requestId) {
      return db.$transaction(async (tx) => {
        const initial = await tx.mfaChallenge.findUnique({ where: { tokenHash } });
        if (!initial) return null;
        await tx.$queryRaw`SELECT id FROM admins WHERE id = ${initial.adminId}::uuid FOR UPDATE`;
        const challenge = await tx.mfaChallenge.findUnique({ where: { tokenHash } });
        const admin = await tx.admin.findUnique({ where: { id: initial.adminId } });
        if (
          !challenge ||
          challenge.usedAt ||
          challenge.expiresAt <= new Date() ||
          !admin?.isActive ||
          digest(admin.passwordHash) !== challenge.passwordVersion
        )
          return null;
        const enrolled = !!challenge.pendingSecret;
        if (enrolled && admin.mfaSecret) return null;
        const encrypted = enrolled ? challenge.pendingSecret : admin.mfaSecret;
        if (!encrypted) return null;
        const step = crypto.step(crypto.decrypt(encrypted, admin.id), code, admin.mfaLastStep);
        if (step === null) {
          if (enrolled || /^\d{6}$/.test(code)) return null;
          const consumed = await tx.recoveryCode.deleteMany({
            where: { adminId: admin.id, tokenHash: digest(code) },
          });
          if (consumed.count !== 1) return null;
          await tx.session.updateMany({
            where: { adminId: admin.id },
            data: { revokedAt: new Date() },
          });
          await recordAudit(tx, "auth.mfa_recovery", admin.id, admin.id, requestId);
        } else {
          await tx.admin.update({
            where: { id: admin.id },
            data: { mfaSecret: encrypted, mfaLastStep: step },
          });
        }
        if (enrolled) {
          await tx.recoveryCode.createMany({
            data: recoveryHashes.map((tokenHash) => ({ adminId: admin.id, tokenHash })),
          });
          await tx.session.updateMany({
            where: { adminId: admin.id },
            data: { revokedAt: new Date() },
          });
          await recordAudit(tx, "auth.mfa_enrolled", admin.id, admin.id, requestId);
        }
        await tx.mfaChallenge.updateMany({
          where: { adminId: admin.id, usedAt: null },
          data: { usedAt: new Date() },
        });
        const session = await createSessionRepository(tx).createSession(
          admin,
          refreshHash,
          challenge.oldHash,
          requestId,
        );
        return { session, enrolled };
      });
    },
  };
}
