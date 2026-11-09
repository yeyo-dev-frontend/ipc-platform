export function parseInvitation(data) {
  const { admin, activationToken, expiresAt } = data ?? {};
  if (
    !admin?.id ||
    !admin.name ||
    !admin.email ||
    !["admin", "admissions", "events"].includes(admin.role) ||
    admin.isActive !== false ||
    !/^[A-Za-z0-9_-]{43}$/.test(activationToken ?? "") ||
    !expiresAt
  ) {
    throw new Error(
      "No se recibió un código de activación válido. Inténtalo de nuevo.",
    );
  }
  return { admin, activationToken, expiresAt };
}
