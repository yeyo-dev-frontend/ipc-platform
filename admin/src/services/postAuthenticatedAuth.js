import { postAuth } from "./authRequest";
import { EXPIRED_NOTICE, getSession, refreshSession } from "./session";

export async function postAuthenticatedAuth(path, input, status) {
  let session = getSession();
  if (!session) throw new Error(EXPIRED_NOTICE);
  if (Date.now() >= session.expiresAt) {
    session = await refreshSession();
    if (!session) throw new Error(EXPIRED_NOTICE);
  }
  try {
    return await postAuth(
      path,
      input,
      status,
      session.csrfToken,
      session.accessToken,
    );
  } catch (error) {
    if (error.status !== 401) throw error;
    const renewed = await refreshSession();
    if (!renewed) throw new Error(EXPIRED_NOTICE);
    return postAuth(
      path,
      input,
      status,
      renewed.csrfToken,
      renewed.accessToken,
    );
  }
}
