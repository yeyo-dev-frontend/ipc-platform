import { fetchCsrf, requestRefresh } from "./requestRefresh";
import { broadcastLogout, broadcastSession } from "./sessionChannel";
import { pauseForBroadcast, withSessionLock } from "./sessionLock";
import {
  EXPIRED_NOTICE,
  applySession,
  getSession,
  setLastActivityAt,
  setNextRetryAt,
  shareRefresh,
} from "./sessionStore";

export function restoreSession() {
  return shareRefresh(() =>
    withSessionLock(async () => {
      const current = getSession();
      if (current && current.expiresAt > Date.now()) {
        return current;
      }
      let csrfToken;
      try {
        csrfToken = await fetchCsrf();
      } catch (error) {
        if (error.status === 401) return null;
        throw error;
      }
      try {
        const session = await requestRefresh(csrfToken);
        setLastActivityAt(Date.now());
        setNextRetryAt(0);
        applySession(session, "");
        broadcastSession(session);
        await pauseForBroadcast();
        return session;
      } catch (error) {
        if (error.status === 401) {
          applySession(null, EXPIRED_NOTICE);
          broadcastLogout(EXPIRED_NOTICE);
          throw new Error(EXPIRED_NOTICE);
        }
        throw error;
      }
    }),
  );
}
