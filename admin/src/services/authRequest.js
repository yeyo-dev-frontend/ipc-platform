const unavailable =
  "No se pudo contactar con el servicio de acceso. Inténtalo de nuevo.";

export async function postAuth(path, input, status) {
  let response;
  try {
    response = await fetch("/api/v1/auth/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-IPC-Client": "admin" },
      credentials: "same-origin",
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error(unavailable);
  }
  const body = await response.json().catch(() => null);
  if (response.status !== status) {
    const error = new Error(body?.error?.message || unavailable);
    error.status = response.status;
    throw error;
  }
  return body?.data;
}
