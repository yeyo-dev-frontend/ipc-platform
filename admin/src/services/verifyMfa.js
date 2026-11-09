import { postAuth } from "./authRequest";
import { parseSession } from "./session";

export async function verifyMfa(challenge, code) {
  const data = await postAuth(
    "mfa/verify",
    { challengeToken: challenge.challengeToken, code },
    200,
  );
  const session = parseSession(data);
  const { recoveryCodes } = data ?? {};
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
    session,
    recoveryCodes: challenge.enrollmentRequired ? recoveryCodes : null,
  };
}
