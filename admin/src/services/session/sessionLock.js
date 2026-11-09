export function withSessionLock(task) {
  if (navigator.locks?.request) {
    return navigator.locks.request("ipc-admin-auth", task);
  }
  return task();
}

export const pauseForBroadcast = () =>
  new Promise((resolve) => setTimeout(resolve, 40));
