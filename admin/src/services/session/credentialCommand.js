import { postAuth } from "../authRequest";
import { fetchCsrf, requestRefresh } from "./requestRefresh";

export async function runCredentialCommand(command, csrfToken) {
  if (command === "refresh") return requestRefresh(csrfToken);
  if (command !== "logout") throw new Error("Operación de sesión desconocida.");
  try {
    await postAuth("logout", {}, 204, csrfToken || (await fetchCsrf()));
  } catch (error) {
    if (error.status === 403 && csrfToken)
      return runCredentialCommand("logout");
    if (error.status !== 401) throw error;
  }
}
