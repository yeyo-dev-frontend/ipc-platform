const unavailable =
  "No se pudo contactar con el servicio de acceso. Inténtalo de nuevo.";

async function sendAuth(path, options, status) {
  let response;
  try {
    response = await fetch("/api/v1/auth/" + path, {
      ...options,
      credentials: "same-origin",
      signal: ["mfa/verify", "csrf", "logout"].includes(path)
        ? AbortSignal.timeout(30_000)
        : undefined,
    });
  } catch {
    throw new Error(unavailable);
  }
  const body =
    status === 204 && response.status === 204
      ? null
      : await response.json().catch(() => null);
  if (response.status !== status) {
    const fieldMessage =
      body?.error?.fields &&
      Object.values(body.error.fields).flat().find(Boolean);
    const error = new Error(
      fieldMessage || body?.error?.message || unavailable,
    );
    error.status = response.status;
    error.code = body?.error?.code;
    error.fields = body?.error?.fields;
    throw error;
  }
  return body?.data;
}

export function getAuth(path, status, accessToken) {
  return sendAuth(
    path,
    {
      method: "GET",
      headers: {
        "X-IPC-Client": "admin",
        ...(accessToken && { Authorization: "Bearer " + accessToken }),
      },
    },
    status,
  );
}

export function postAuth(path, input, status, csrfToken, accessToken) {
  const headers = {
    "Content-Type": "application/json",
    "X-IPC-Client": "admin",
  };
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  if (accessToken) headers.Authorization = "Bearer " + accessToken;
  return sendAuth(
    path,
    { method: "POST", headers, body: JSON.stringify(input) },
    status,
  );
}
