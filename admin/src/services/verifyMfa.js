import { postAuth } from "./authRequest";

export async function verifyMfa(challenge, code) {
  const data = await postAuth(
    "mfa/verify",
    { challengeToken: challenge.challengeToken, code },
    200,
  );
  const { accessToken, tokenType, csrfToken, expiresIn, admin, recoveryCodes } =
    data ?? {};
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
  if (
    challenge.enrollmentRequired &&
    (!Array.isArray(recoveryCodes) ||
      recoveryCodes.length !== 10 ||
      !recoveryCodes.every(
        (value) =>
          typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value),
      ))
  ) {
    throw new Error(
      "No se recibieron los códigos de recuperación. Contacta con el administrador.",
    );
  }
  return {
    session: {
      admin,
      accessToken,
      csrfToken,
      expiresAt: Date.now() + expiresIn * 1000,
    },
    recoveryCodes: challenge.enrollmentRequired ? recoveryCodes : null,
  };
}
