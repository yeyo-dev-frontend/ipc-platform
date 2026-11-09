import { refreshSession } from "./refreshSession";
import { broadcastActivity, broadcastSession } from "./sessionChannel";
import {
  SESSION_IDLE_MS,
  applySession,
  getLastActivityAt,
  getNextRetryAt,
  getSession,
  setLastActivityAt,
  setNextRetryAt,
  setSessionHook,
} from "./sessionStore";
import { expireIdleSession, syncSessionTimers } from "./sessionTimers";

const ACTIVITY_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "keyup",
  "wheel",
  "touchstart",
  "focus",
];

let lastBroadcastAt = 0;
let listeningActivity = false;

function onActivity(event) {
  const current = getSession();
  if (!current) return;
  if (
    event?.type === "visibilitychange" &&
    document.visibilityState === "hidden"
  ) {
    return;
  }
  if (
    event?.target instanceof Element &&
    event.target.closest("[data-logout]")
  ) {
    return;
  }
  const now = Date.now();
  if (now - getLastActivityAt() >= SESSION_IDLE_MS) {
    expireIdleSession();
    return;
  }
  setLastActivityAt(now);
  if (now - lastBroadcastAt > 5_000) {
    lastBroadcastAt = now;
    broadcastActivity(now);
  }
  if (now >= current.expiresAt && now >= getNextRetryAt()) {
    refreshSession().catch(() => {});
  }
}

function setActivityListeners(enabled) {
  if (listeningActivity === enabled) return;
  listeningActivity = enabled;
  for (const type of ACTIVITY_EVENTS) {
    if (enabled) window.addEventListener(type, onActivity, { passive: true });
    else window.removeEventListener(type, onActivity);
  }
  if (enabled) document.addEventListener("visibilitychange", onActivity);
  else document.removeEventListener("visibilitychange", onActivity);
}

setSessionHook((session) => {
  setActivityListeners(Boolean(session));
  syncSessionTimers(session);
});

export function acceptSession(session) {
  setLastActivityAt(Date.now());
  setNextRetryAt(0);
  applySession(session, "");
  broadcastSession(session);
}
