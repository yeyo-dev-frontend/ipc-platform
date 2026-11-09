import { readInput } from "../../middleware/readInput.js";
import { Hono } from "hono";
import { AppError } from "../../middleware/errors.js";
import { z } from "zod";
import { loginSchema } from "./authSchema.js";
import { readRefreshCookie, sendTokens, clearAuthCookies } from "./authCookies.js";

export function createCredentialRoutes(service, config, throttle) {
  const routes = new Hono();
  routes.post("/login", throttle, async (c) => {
    const data = await readInput(c, loginSchema);
    const result = await service.login(data, readRefreshCookie(c), c.get("requestId"));
    clearAuthCookies(c, config);
    return c.json({ data: result }, 202);
  });
  routes.post("/mfa/verify", throttle, async (c) => {
    const data = await readInput(
      c,
      z
        .object({
          challengeToken: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
          code: z.string().regex(/^(?:[0-9]{6}|[A-Za-z0-9_-]{43})$/),
        })
        .strict(),
    );
    return sendTokens(c, await service.completeMfa(data, c.get("requestId")), config);
  });
  routes.get("/csrf", async (c) => {
    if (
      c.req.header("X-IPC-Client") !== "admin" ||
      (c.req.header("Origin") && c.req.header("Origin") !== config.origin)
    ) {
      throw new AppError(403, "INVALID_ORIGIN", "Origen de solicitud no permitido.");
    }
    await service.throttleRefresh(c.get("clientIp"));
    return c.json({ data: { csrfToken: await service.refreshCsrf(readRefreshCookie(c)) } });
  });
  routes.post("/refresh", async (c) => {
    await service.throttleRefresh(c.get("clientIp"));
    try {
      const result = await service.refresh(
        readRefreshCookie(c),
        c.req.header("X-CSRF-Token"),
        c.get("requestId"),
      );
      return sendTokens(c, result, config);
    } catch (error) {
      if (error.status === 401) clearAuthCookies(c, config);
      throw error;
    }
  });
  routes.post("/logout", async (c) => {
    await service.throttleRefresh(c.get("clientIp"));
    try {
      await service.logout(readRefreshCookie(c), c.req.header("X-CSRF-Token"), c.get("requestId"));
    } catch (error) {
      if (error.status === 401) clearAuthCookies(c, config);
      throw error;
    }
    clearAuthCookies(c, config);
    return c.body(null, 204);
  });
  return routes;
}
