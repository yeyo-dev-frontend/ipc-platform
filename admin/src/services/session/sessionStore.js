export const SESSION_IDLE_MS = 30 * 60_000;
export const EXPIRED_NOTICE = "La sesión ha vencido. Vuelve a iniciar sesión.";

const listeners = new Set();
let currentSession = null;
let lastActivityAt = Date.now();
let nextRetryAt = 0;
let pendingRefresh = null;
let onSessionChanged = null;

export const getSession = () => currentSession;
export const getLastActivityAt = () => lastActivityAt;
export const setLastActivityAt = (at) => {
  lastActivityAt = at;
};
export const getNextRetryAt = () => nextRetryAt;
export const setNextRetryAt = (at) => {
  nextRetryAt = at;
};

export function setSessionHook(hook) {
  onSessionChanged = hook;
}

export function observeSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function applySession(session, notice = "") {
  currentSession = session;
  onSessionChanged?.(session);
  for (const listener of listeners) {
    listener({ session, notice });
  }
}

export function shareRefresh(factory) {
  if (pendingRefresh) return pendingRefresh;
  pendingRefresh = factory().finally(() => {
    pendingRefresh = null;
  });
  return pendingRefresh;
}
