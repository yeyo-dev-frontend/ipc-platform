import { logoutSession } from "./logoutSession";
import { isRecoveryPending } from "./recoveryPending";
import { refreshSession } from "./refreshSession";
import { broadcastLogout, subscribeChannel } from "./sessionChannel";
import {
  EXPIRED_NOTICE,
  SESSION_IDLE_MS,
  applySession,
  getLastActivityAt,
  getSession,
  setLastActivityAt,
} from "./sessionStore";

let jwtTimer = null;
let idleTimer = null;

export async function expireIdleSession() {
  if (!getSession()) return;
  try {
    await logoutSession(EXPIRED_NOTICE);
  } catch {
    applySession(null, EXPIRED_NOTICE);
    broadcastLogout(EXPIRED_NOTICE);
  }
}

function checkIdle() {
  clearTimeout(idleTimer);
  if (!getSession()) return;
  const remaining = getLastActivityAt() + SESSION_IDLE_MS - Date.now();
  if (remaining <= 0) {
    expireIdleSession();
    return;
  }
  idleTimer = setTimeout(checkIdle, remaining);
}

export function syncSessionTimers(session) {
  clearTimeout(jwtTimer);
  clearTimeout(idleTimer);
  if (!session) return;
  const delay = Math.max(0, session.expiresAt - Date.now());
  jwtTimer = setTimeout(() => {
    const current = getSession();
    if (current && getLastActivityAt() > current.obtainedAt) {
      refreshSession().catch(() => {});
    }
  }, delay);
  checkIdle();
}

subscribeChannel((data) => {
  if (data?.type === "session" && data.session) {
    if (isRecoveryPending()) return;
    setLastActivityAt(Math.max(getLastActivityAt(), data.session.obtainedAt));
    applySession(data.session, "");
  } else if (data?.type === "logout") {
    applySession(null, data.notice || "");
  } else if (data?.type === "activity" && Number.isFinite(data.at)) {
    setLastActivityAt(Math.max(getLastActivityAt(), data.at));
  }
});
