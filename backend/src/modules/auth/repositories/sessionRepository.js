import { publicAdmin } from "../../admins/adminRepository.js";
import { recordAudit } from "../../audit/auditRepository.js";
import { isSessionActive, unauthorized } from "../sessionPolicy.js";
import { SESSION_IDLE_MS, SESSION_MAX_MS } from "../authSettings.js";

export function createSessionRepository(db) {
  const transact = (fn) => (db.$transaction ? db.$transaction(fn) : fn(db));
  return {
    async createSession(admin, tokenHash, oldHash, requestId) {
      return transact(async (tx) => {
        const current = await tx.admin.findUnique({ where: { id: admin.id } });
        if (!current?.isActive || current.passwordHash !== admin.passwordHash) throw unauthorized();
        if (oldHash) {
          const old = await tx.refreshToken.findUnique({ where: { tokenHash: oldHash } });
          if (old)
            await tx.session.update({
              where: { id: old.sessionId },
              data: { revokedAt: new Date() },
            });
        }
        const session = await tx.session.create({
          data: {
            adminId: admin.id,
            expiresAt: new Date(Date.now() + SESSION_MAX_MS),
            refreshTokens: { create: { tokenHash } },
          },
          include: { admin: { select: publicAdmin } },
        });
        await recordAudit(tx, "auth.login", admin.id, admin.id, requestId);
        return session;
      });
    },
    async session(sessionId, adminId) {
      const now = new Date();
      const touched = await db.session.updateMany({
        where: {
          id: sessionId,
          adminId,
          revokedAt: null,
          expiresAt: { gt: now },
          lastSeenAt: { gt: new Date(now.getTime() - SESSION_IDLE_MS) },
          admin: { isActive: true },
        },
        data: { lastSeenAt: now },
      });
      if (touched.count !== 1) throw unauthorized();
      const session = await db.session.findUnique({
        where: { id: sessionId },
        include: { admin: { select: publicAdmin } },
      });
      if (!isSessionActive(session)) throw unauthorized();
      return { admin: session.admin, sessionId };
    },
    async logout(sessionId, requestId) {
      await db.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT id FROM sessions WHERE id = ${sessionId}::uuid FOR UPDATE`;
        const session = await tx.session.update({
          where: { id: sessionId },
          data: { revokedAt: new Date() },
        });
        await recordAudit(tx, "auth.logout", session.adminId, session.adminId, requestId);
      });
    },
  };
}
