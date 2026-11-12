import { AppError } from "../../middleware/errors.js";
import { recordAudit } from "../audit/auditRepository.js";
import { assertAdminSession } from "../auth/sessionPolicy.js";

export const publicAdmin = { id: true, name: true, email: true, role: true, isActive: true };

export function createAdminRepository(db) {
  return {
    listAccounts: () =>
      db.admin.findMany({ select: publicAdmin, orderBy: [{ name: "asc" }, { id: "asc" }] }),
    findByEmail: (email) => db.admin.findUnique({ where: { email } }),
    async deactivateAccount(actor, targetId, requestId) {
      return db.$transaction(async (tx) => {
        await assertAdminSession(tx, actor);
        await tx.$queryRaw`SELECT id FROM admins WHERE role = 'admin' AND "isActive" = true ORDER BY id FOR UPDATE`;
        const rows = await tx.$queryRaw`SELECT id FROM admins WHERE id = ${targetId}::uuid FOR UPDATE`;
        if (!rows.length) {
          throw new AppError(404, "ACCOUNT_NOT_FOUND", "Cuenta no encontrada.");
        }
        const target = await tx.admin.findUnique({ where: { id: targetId } });
        if (!target.isActive) {
          throw new AppError(409, "ACCOUNT_INACTIVE", "Esta cuenta ya está inactiva.");
        }
        if (target.role === "admin") {
          const activeAdmins = await tx.admin.count({
            where: { role: "admin", isActive: true },
          });
          if (activeAdmins <= 1) {
            throw new AppError(
              409,
              "LAST_ADMIN_PROTECTED",
              "No se puede desactivar al último administrador activo.",
            );
          }
        }
        const now = new Date();
        const admin = await tx.admin.update({
          where: { id: target.id },
          data: { isActive: false },
          select: publicAdmin,
        });
        await tx.session.updateMany({
          where: { adminId: target.id, revokedAt: null },
          data: { revokedAt: now },
        });
        await tx.mfaChallenge.updateMany({
          where: { adminId: target.id, usedAt: null },
          data: { usedAt: now },
        });
        await tx.activation.deleteMany({
          where: { adminId: target.id, usedAt: null },
        });
        await recordAudit(tx, "admin.deactivate", actor.admin.id, target.id, requestId);
        return admin;
      });
    },
  };
}
