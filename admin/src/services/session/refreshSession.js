import { sessionCommand } from "./sessionCommand";
import { isRecoveryPending } from "./recoveryPending";
import { broadcastLogout, broadcastSession } from "./sessionChannel";
import { pauseForBroadcast, withSessionLock } from "./sessionLock";
import {
  EXPIRED_NOTICE,
  applySession,
  getSession,
  setNextRetryAt,
  shareRefresh,
} from "./sessionStore";

export function refreshSession() {
  const previousToken = getSession()?.accessToken;
  if (!previousToken) return Promise.resolve(null);
  return shareRefresh(() =>
    withSessionLock(async () => {
      const current = getSession();
      if (!current || isRecoveryPending()) return null;
      if (
        current.accessToken !== previousToken &&
        current.expiresAt > Date.now()
      ) {
        return current;
      }
      try {
        const session = await sessionCommand("refresh", current.csrfToken);
        if (isRecoveryPending()) return null;
        setNextRetryAt(0);
        applySession(session, "");
        broadcastSession(session);
        await pauseForBroadcast();
        return session;
      } catch (error) {
        if (error.status === 401) {
          applySession(null, EXPIRED_NOTICE);
          broadcastLogout(EXPIRED_NOTICE);
          await pauseForBroadcast();
          return null;
        }
        setNextRetryAt(Date.now() + 5_000);
        throw error;
      }
    }),
  );
}
