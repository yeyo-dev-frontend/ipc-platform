import { runCredentialCommand } from "./credentialCommand";

let worker;
let nextId = 0;
const pending = new Map();

function getWorker() {
  if (!worker) {
    worker = new SharedWorker(new URL("./sessionWorker.js", import.meta.url), {
      type: "module",
      name: "ipc-admin-session",
    });
    worker.port.onmessage = ({ data }) => {
      const request = pending.get(data.id);
      if (!request) return;
      pending.delete(data.id);
      if (data.error)
        request.reject(
          Object.assign(new Error(data.error.message), {
            status: data.error.status,
          }),
        );
      else request.resolve(data.value);
    };
    worker.onerror = () => {
      for (const request of pending.values())
        request.reject(
          new Error("No se pudo coordinar la sesión. Recarga el panel."),
        );
      pending.clear();
      worker.port.close();
      worker = null;
    };
  }
  return worker;
}

export async function sessionCommand(command, csrfToken) {
  if (navigator.locks?.request) return runCredentialCommand(command, csrfToken);
  if (typeof SharedWorker === "undefined")
    throw new Error(
      "Para gestionar la sesión, abre el panel en un navegador compatible con Web Locks o SharedWorker.",
    );
  const port = getWorker().port;
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    port.postMessage({ id, command, csrfToken });
  });
}
