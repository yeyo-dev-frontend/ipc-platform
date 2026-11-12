import { AppError } from "../../../middleware/errors.js";
import { publicAdmin } from "../../admins/adminRepository.js";
import { recordAudit } from "../../audit/auditRepository.js";
import { assertAdminSession } from "../sessionPolicy.js";

export function createActivationRepository(db) {
  return {
    async reissue(email, tokenHash, expiresAt, actor, requestId) {
      return db.$transaction(async (tx) => {
        if (actor) {
          await assertAdminSession(tx, actor);
        }
        const rows = await tx.$queryRaw`SELECT id FROM admins WHERE email = ${email} FOR UPDATE`;
        if (!rows.length) throw new AppError(404, "ACCOUNT_NOT_FOUND", "Cuenta no encontrada.");
        const admin = await tx.admin.findUnique({ where: { id: rows[0].id } });
        if (admin.isActive)
          throw new AppError(
            409,
            "ACCOUNT_ACTIVE",
            "Esta cuenta ya está activa. No se puede reiniciar su contraseña con una invitación.",
          );
        const pendingActivation = await tx.activation.findFirst({
          where: { adminId: admin.id, usedAt: null },
        });
        if (!pendingActivation)
          throw new AppError(
            409,
            "ACCOUNT_DEACTIVATED",
            "Esta cuenta fue desactivada. No se puede reemitir su invitación inicial.",
          );
        await tx.activation.deleteMany({ where: { adminId: admin.id } });
        await tx.activation.create({ data: { adminId: admin.id, tokenHash, expiresAt } });
        await recordAudit(
          tx,
          "admin.activation_reissued",
          actor?.admin.id ?? null,
          admin.id,
          requestId,
        );
        return tx.admin.findUnique({ where: { id: admin.id }, select: publicAdmin });
      });
    },
    async activate(tokenHash, passwordHash, requestId) {
      return db.$transaction(async (tx) => {
        const invitation = await tx.activation.findUnique({ where: { tokenHash } });
        const invalid = () =>
          new AppError(400, "INVALID_ACTIVATION", "El código de activación no es válido o venció.");
        if (!invitation) throw invalid();
        await tx.$queryRaw`SELECT id FROM admins WHERE id = ${invitation.adminId}::uuid FOR UPDATE`;
        const used = await tx.activation.updateMany({
          where: { id: invitation.id, usedAt: null, expiresAt: { gt: new Date() } },
          data: { usedAt: new Date() },
        });
        if (used.count !== 1) throw invalid();
        const updated = await tx.admin.updateMany({
          where: { id: invitation.adminId, isActive: false },
          data: { passwordHash, isActive: true },
        });
        if (updated.count !== 1) throw invalid();
        await tx.session.deleteMany({ where: { adminId: invitation.adminId } });
        await recordAudit(tx, "admin.activate", invitation.adminId, invitation.adminId, requestId);
        return tx.admin.findUnique({ where: { id: invitation.adminId }, select: publicAdmin });
      });
    },
  };
}
