import { runCredentialCommand } from "./credentialCommand";

let queue = Promise.resolve();
self.onconnect = ({ ports: [port] }) => {
  port.onmessage = ({ data: { id, command, csrfToken } }) => {
    queue = queue
      .then(async () => {
        try {
          const value = await runCredentialCommand(command, csrfToken);
          port.postMessage({ id, value });
        } catch (error) {
          port.postMessage({
            id,
            error: { message: error.message, status: error.status },
          });
        }
      })
      .catch(() => {});
  };
};
