import { clearRecoveryPending } from "./recoveryPending";
import { sessionCommand } from "./sessionCommand";
import { broadcastLogout } from "./sessionChannel";
import { pauseForBroadcast, withSessionLock } from "./sessionLock";
import { applySession, getSession } from "./sessionStore";

export async function logoutSession(notice = "") {
  await withSessionLock(async () => {
    await sessionCommand("logout", getSession()?.csrfToken);
    clearRecoveryPending();
    applySession(null, notice);
    broadcastLogout(notice);
    await pauseForBroadcast();
  });
}
