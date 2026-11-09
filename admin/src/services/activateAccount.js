import { postAuth } from "./authRequest";

export async function activateAccount(token, password) {
  const data = await postAuth("activate", { token, password }, 200);
  if (
    !data?.id ||
    !data.name ||
    !data.email ||
    !["admin", "admissions", "events"].includes(data.role) ||
    data.isActive !== true
  ) {
    throw new Error(
      "No se pudo confirmar la activación de la cuenta. Inténtalo de nuevo.",
    );
  }
  return data;
}
