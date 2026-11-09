import { postAuth } from "../authRequest";
import { clearRecoveryPending } from "./recoveryPending";
import { fetchCsrf } from "./requestRefresh";
import { broadcastLogout } from "./sessionChannel";
import { pauseForBroadcast, withSessionLock } from "./sessionLock";
import { applySession, getSession } from "./sessionStore";

export async function logoutSession(notice = "") {
  clearRecoveryPending();
  const csrfToken = getSession()?.csrfToken;
  await withSessionLock(async () => {
    try {
      const token = csrfToken || (await fetchCsrf());
      await postAuth("logout", {}, 204, token);
    } catch (error) {
      if (error.status === 403 && csrfToken) {
        try {
          await postAuth("logout", {}, 204, await fetchCsrf());
        } catch (retryError) {
          if (retryError.status !== 401) throw retryError;
        }
      } else if (error.status !== 401) {
        throw error;
      }
    }
    applySession(null, notice);
    broadcastLogout(notice);
    await pauseForBroadcast();
  });
}
