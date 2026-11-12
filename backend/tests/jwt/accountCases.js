import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { finishTestLogin } from "../helpers/mfaLogin.js";

export async function accountCases(t, context) {
  await t.test("solo admin puede consultar cuentas activas y pendientes sin secretos", async () => {
    await context.fresh();
    const session = await context.login();
    const pending = await context.request(
      "/register",
      {
        name: "Cuenta pendiente",
        email: "listado@example.test",
        role: "events",
      },
      session,
      { "X-CSRF-Token": session.csrfToken },
    );
    assert.equal(pending.status, 201);
    assert.equal((await context.request("/accounts")).status, 401);
    const response = await context.request("/accounts", undefined, session);
    assert.equal(response.status, 200);
    const {
      data: { accounts },
    } = await response.json();
    assert.ok(accounts.some((account) => account.id === session.admin.id && account.isActive));
    assert.ok(
      accounts.some((account) => account.email === "listado@example.test" && !account.isActive),
    );
    for (const account of accounts)
      assert.deepEqual(Object.keys(account).sort(), ["email", "id", "isActive", "name", "role"]);
    for (const role of ["admissions", "events"]) {
      await context.db.admin.update({ where: { id: session.admin.id }, data: { role } });
      assert.equal((await context.request("/accounts", undefined, session)).status, 403);
    }
    await context.db.admin.update({ where: { id: session.admin.id }, data: { role: "admin" } });
  });

  await t.test(
    "desactivación revoca sesiones activas, protege al último admin en concurrencia y bloquea reemisión",
    async () => {
      await context.fresh();
      const adminSession = await context.login();
      const password = "ClaveSeguraDePrueba#2026";

      assert.equal(
        (await context.request("/accounts/deactivate", { id: adminSession.admin.id })).status,
        401,
      );
      assert.equal(
        (
          await context.request(
            "/accounts/deactivate",
            { id: adminSession.admin.id },
            adminSession,
            { "X-CSRF-Token": "invalido" },
          )
        ).status,
        403,
      );
      assert.equal(
        (await context.request("/accounts/deactivate", { id: randomUUID() }, adminSession)).status,
        404,
      );

      const pendingAccount = await context.db.admin.findUnique({
        where: { email: "listado@example.test" },
      });
      const inactiveRes = await context.request(
        "/accounts/deactivate",
        { id: pendingAccount.id },
        adminSession,
      );
      assert.equal(inactiveRes.status, 409);
      assert.equal((await inactiveRes.json()).error.code, "ACCOUNT_INACTIVE");

      const lastAdminRes = await context.request(
        "/accounts/deactivate",
        { id: adminSession.admin.id },
        adminSession,
      );
      assert.equal(lastAdminRes.status, 409);
      assert.equal((await lastAdminRes.json()).error.code, "LAST_ADMIN_PROTECTED");

      const invitedEvents = (
        await (
          await context.request(
            "/register",
            { name: "Eventos Activo", email: "eventos.activo@example.test", role: "events" },
            adminSession,
          )
        ).json()
      ).data;
      assert.equal(
        (
          await context.request("/activate", {
            token: invitedEvents.activationToken,
            password,
          })
        ).status,
        200,
      );
      const eventsSession = await context.read(
        await finishTestLogin(
          await context.request("/login", { email: "eventos.activo@example.test", password }),
          context.request,
          context.db,
          context.config,
          "eventos.activo@example.test",
        ),
      );

      assert.equal(
        (
          await context.request(
            "/accounts/deactivate",
            { id: adminSession.admin.id },
            eventsSession,
          )
        ).status,
        403,
      );

      const deactivatedRes = await context.request(
        "/accounts/deactivate",
        { id: eventsSession.admin.id },
        adminSession,
      );
      assert.equal(deactivatedRes.status, 200);
      const {
        data: { admin: deactivatedAdmin },
      } = await deactivatedRes.json();
      assert.equal(deactivatedAdmin.id, eventsSession.admin.id);
      assert.equal(deactivatedAdmin.isActive, false);

      assert.equal((await context.request("/me", undefined, eventsSession)).status, 401);
      assert.equal((await context.request("/refresh", {}, eventsSession)).status, 401);

      const reissueDeactivated = await context.request(
        "/activation/reissue",
        { email: "eventos.activo@example.test" },
        adminSession,
      );
      assert.equal(reissueDeactivated.status, 409);
      assert.equal((await reissueDeactivated.json()).error.code, "ACCOUNT_DEACTIVATED");

      const invitedSecondAdmin = (
        await (
          await context.request(
            "/register",
            { name: "Segundo Admin", email: "admin2@example.test", role: "admin" },
            adminSession,
          )
        ).json()
      ).data;
      assert.equal(
        (
          await context.request("/activate", {
            token: invitedSecondAdmin.activationToken,
            password,
          })
        ).status,
        200,
      );

      const [r1, r2] = await Promise.all([
        context.request(
          "/accounts/deactivate",
          { id: invitedSecondAdmin.admin.id },
          adminSession,
        ),
        context.request("/accounts/deactivate", { id: adminSession.admin.id }, adminSession),
      ]);
      assert.deepEqual([r1.status, r2.status].sort(), [200, 409]);
      assert.equal(
        await context.db.admin.count({ where: { role: "admin", isActive: true } }),
        1,
      );

      const auditEntry = await context.db.auditLog.findFirst({
        where: { action: "admin.deactivate", targetId: eventsSession.admin.id },
      });
      assert.ok(auditEntry);
    },
  );
}
