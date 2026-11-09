const channel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("ipc-admin-auth")
    : null;

export function broadcastSession(session) {
  channel?.postMessage({ type: "session", session });
}

export function broadcastLogout(notice = "") {
  channel?.postMessage({ type: "logout", notice });
}

export function broadcastActivity(at) {
  channel?.postMessage({ type: "activity", at });
}

export function subscribeChannel(onMessage) {
  if (!channel) return () => {};
  const handler = ({ data }) => onMessage(data);
  channel.addEventListener("message", handler);
  return () => channel.removeEventListener("message", handler);
}
