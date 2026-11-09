import { logoutSession } from "./logoutSession";
import { fetchCsrf } from "./requestRefresh";
import { sessionCommand } from "./sessionCommand";
import {
  UNCONFIRMED_RECOVERY_NOTICE,
  isRecoveryOwner,
  WAITING_NOTICE,
  isRecoveryPending,
  RECOVERY_KEY,
} from "./recoveryPending";
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

async function restore() {
  if (isRecoveryPending()) {
    if (performance.getEntriesByType("navigation")[0]?.type !== "reload") {
      sessionStorage.removeItem(RECOVERY_KEY);
    }
    if (
      !isRecoveryOwner() ||
      performance.getEntriesByType("navigation")[0]?.type !== "reload"
    )
      throw new Error(WAITING_NOTICE);
    await logoutSession(UNCONFIRMED_RECOVERY_NOTICE);
    throw new Error(UNCONFIRMED_RECOVERY_NOTICE);
  }
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
        const session = await sessionCommand("refresh", csrfToken);
        if (isRecoveryPending()) throw new Error(WAITING_NOTICE);
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

let restoring = null;
export function restoreSession() {
  return (restoring ??= restore().finally(() => {
    restoring = null;
  }));
}
