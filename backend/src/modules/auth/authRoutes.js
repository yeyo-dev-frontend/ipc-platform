import { readInput } from "../../middleware/readInput.js";
import { adminRequest, noStore } from "../../middleware/adminRequest.js";
import { jsonBody } from "../../middleware/requestBody.js";
import { Hono } from "hono";
import { authenticate, requireAdmin, requireCsrf } from "../../middleware/authenticate.js";
import {
  activateSchema,
  deactivateAccountSchema,
  registerSchema,
  reissueSchema,
} from "./authSchema.js";
import { createCredentialRoutes } from "./credentialRoutes.js";

export function createAuthRoutes(service, config, clientIp) {
  const routes = new Hono();
  routes.use("*", noStore, adminRequest(config), ...jsonBody());
  const authenticated = authenticate(service);
  routes.use("*", async (c, next) => {
    c.set("clientIp", clientIp(c));
    await next();
  });
  const throttle = async (c, next) => {
    await service.throttle(c.get("clientIp"));
    await next();
  };
  routes.route("/", createCredentialRoutes(service, config, throttle));
  routes.get("/accounts", authenticated, requireAdmin, async (c) =>
    c.json({ data: { accounts: await service.listAccounts() } }),
  );
  routes.post(
    "/accounts/deactivate",
    authenticated,
    requireAdmin,
    requireCsrf,
    throttle,
    async (c) => {
      const data = await readInput(c, deactivateAccountSchema);
      return c.json({
        data: await service.deactivateAccount(c.get("actor"), data.id, c.get("requestId")),
      });
    },
  );
  routes.post("/register", authenticated, requireAdmin, requireCsrf, throttle, async (c) => {
    const data = await readInput(c, registerSchema);
    return c.json({ data: await service.register(c.get("actor"), data, c.get("requestId")) }, 201);
  });
  routes.post(
    "/activation/reissue",
    authenticated,
    requireAdmin,
    requireCsrf,
    throttle,
    async (c) => {
      const data = await readInput(c, reissueSchema);
      return c.json({
        data: await service.reissue(data.email, c.get("actor"), c.get("requestId")),
      });
    },
  );
  routes.post("/activate", throttle, async (c) => {
    const data = await readInput(c, activateSchema);
    return c.json({ data: await service.activate(data, c.get("requestId")) });
  });
  routes.get("/me", authenticated, (c) =>
    c.json({ data: { admin: c.get("actor").admin, csrfToken: c.get("actor").csrfToken } }),
  );
  return routes;
}
