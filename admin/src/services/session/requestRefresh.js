import { getAuth, postAuth } from "../authRequest";
import { parseSession } from "./parseSession";

export async function fetchCsrf() {
  const data = await getAuth("csrf", 200);
  if (typeof data?.csrfToken !== "string" || !data.csrfToken) {
    throw new Error("No se pudo confirmar la sesión. Vuelve al acceso.");
  }
  return data.csrfToken;
}

export async function requestRefresh(csrfToken) {
  const token = csrfToken || (await fetchCsrf());
  try {
    return parseSession(await postAuth("refresh", {}, 200, token));
  } catch (error) {
    if (error.status === 403 && csrfToken) {
      return parseSession(
        await postAuth("refresh", {}, 200, await fetchCsrf()),
      );
    }
    throw error;
  }
}
