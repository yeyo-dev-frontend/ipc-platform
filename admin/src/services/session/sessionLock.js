// El navegador con Web Locks serializa la operación completa. En los demás,
// sessionCommand delega las solicitudes de red a una única cola en un SharedWorker.
export function withSessionLock(task) {
  if (navigator.locks?.request)
    return navigator.locks.request("ipc-admin-auth", task);
  return task();
}
export const pauseForBroadcast = () =>
  new Promise((resolve) => setTimeout(resolve, 40));
