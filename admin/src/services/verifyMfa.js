import { postAuth } from "./authRequest";
import { parseSession } from "./session";
import { logoutSession } from "./session/logoutSession";
import {
  markRecoveryPending,
  clearRecoveryPending,
  isRecoveryOwner,
  UNCONFIRMED_RECOVERY_NOTICE,
} from "./session/recoveryPending";

export async function verifyMfa(challenge, code) {
  if (challenge.enrollmentRequired) markRecoveryPending();
  let data;
  try {
    data = await postAuth(
      "mfa/verify",
      { challengeToken: challenge.challengeToken, code },
      200,
    );
  } catch (error) {
    if (
      challenge.enrollmentRequired &&
      [400, 401, 403, 413, 415, 422, 429].includes(error.status) &&
      isRecoveryOwner()
    )
      clearRecoveryPending();
    throw error;
  }
  const session = parseSession(data);
  if (challenge.enrollmentRequired && !isRecoveryOwner()) {
    await logoutSession(UNCONFIRMED_RECOVERY_NOTICE);
    throw new Error(UNCONFIRMED_RECOVERY_NOTICE);
  }
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
