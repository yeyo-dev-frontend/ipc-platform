import { parseInvitation } from "./parseInvitation";
import { postAuthenticatedAuth } from "./postAuthenticatedAuth";

export async function registerAdmin(input) {
  return parseInvitation(await postAuthenticatedAuth("register", input, 201));
}
