import { parseInvitation } from "./parseInvitation";
import { postAuthenticatedAuth } from "./postAuthenticatedAuth";

export async function reissueActivation(email) {
  return parseInvitation(
    await postAuthenticatedAuth("activation/reissue", { email }, 200),
  );
}
