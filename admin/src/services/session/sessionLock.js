const lockChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("ipc-admin-lock")
    : null;

const tabId =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random()).slice(2);

let localQueue = Promise.resolve();
let remoteTicket = null;
const releaseWaiters = new Set();

lockChannel?.addEventListener("message", ({ data }) => {
  if (data?.type === "claim") {
    if (!remoteTicket || data.ticket < remoteTicket) {
      remoteTicket = data.ticket;
    }
  } else if (data?.type === "release") {
    if (remoteTicket === data.ticket) {
      remoteTicket = null;
    }
    for (const notify of releaseWaiters) notify();
  }
});

function waitForTurn(myTicket) {
  return new Promise((resolve) => {
    const timer = setTimeout(cleanup, 3000);
    function check() {
      if (!remoteTicket || myTicket < remoteTicket) {
        cleanup();
      }
    }
    function cleanup() {
      clearTimeout(timer);
      releaseWaiters.delete(check);
      resolve();
    }
    releaseWaiters.add(check);
    check();
  });
}

function runFallbackLock(task) {
  const next = localQueue.then(async () => {
    if (!lockChannel) return task();
    const myTicket = `${Date.now()}-${tabId}`;
    lockChannel.postMessage({ type: "claim", ticket: myTicket });
    await new Promise((resolve) => setTimeout(resolve, 25));
    if (remoteTicket && remoteTicket < myTicket) {
      await waitForTurn(myTicket);
    }
    try {
      return await task();
    } finally {
      lockChannel.postMessage({ type: "release", ticket: myTicket });
    }
  });
  localQueue = next.catch(() => {});
  return next;
}

export function withSessionLock(task) {
  if (navigator.locks?.request) {
    return navigator.locks.request("ipc-admin-auth", task);
  }
  return runFallbackLock(task);
}

export const pauseForBroadcast = () =>
  new Promise((resolve) => setTimeout(resolve, 40));
