export function parseSession(data) {
  const { accessToken, tokenType, csrfToken, expiresIn, admin } = data ?? {};
  if (
    typeof accessToken !== "string" ||
    !accessToken ||
    tokenType !== "Bearer" ||
    typeof csrfToken !== "string" ||
    !csrfToken ||
    !Number.isInteger(expiresIn) ||
    expiresIn <= 0 ||
    !admin?.id ||
    !admin.name ||
    !["admin", "admissions", "events"].includes(admin.role)
  ) {
    throw new Error("No se pudo confirmar la sesión. Vuelve al acceso.");
  }
  const now = Date.now();
  return {
    admin,
    accessToken,
    csrfToken,
    obtainedAt: now,
    expiresAt: now + expiresIn * 1000,
  };
}
