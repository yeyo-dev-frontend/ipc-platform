export const publicAdmin = { id: true, name: true, email: true, role: true, isActive: true };

export function createAdminRepository(db) {
  return {
    listAccounts: () =>
      db.admin.findMany({ select: publicAdmin, orderBy: [{ name: "asc" }, { id: "asc" }] }),
    findByEmail: (email) => db.admin.findUnique({ where: { email } }),
  };
}
