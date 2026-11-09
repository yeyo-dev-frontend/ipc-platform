import { postAuth } from "./authRequest";

export async function login(email, password) {
  const data = await postAuth("login", { email, password }, 202);
  if (
    data?.mfaRequired !== true ||
    typeof data.enrollmentRequired !== "boolean" ||
    !/^[A-Za-z0-9_-]{43}$/.test(data.challengeToken ?? "") ||
    !Number.isInteger(data.expiresIn) ||
    data.expiresIn <= 0 ||
    (data.enrollmentRequired &&
      !(typeof data.secret === "string" && data.secret.length))
  ) {
    throw new Error(
      "El servicio no devolvió un desafío válido. Vuelve a iniciar sesión.",
    );
  }
  return data;
}
