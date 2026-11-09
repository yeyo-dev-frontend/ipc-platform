import { test } from "node:test";
import { createJwtContext } from "./helpers/jwtContext.js";
import { claimsCases } from "./jwt/claimsCases.js";
import { rotationCases } from "./jwt/rotationCases.js";
import { lifecycleCases } from "./jwt/lifecycleCases.js";
import { csrfCases } from "./jwt/csrfCases.js";
import assert from "node:assert/strict";

test("JWT y refresh rotativo con PostgreSQL real", async (t) => {
  const context = await createJwtContext();
  try {
    await claimsCases(t, context);
    await rotationCases(t, context);
    await lifecycleCases(t, context);
    await csrfCases(t, context);
    await t.test(
      "solo admin puede consultar cuentas activas y pendientes sin secretos",
      async () => {
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
          assert.deepEqual(Object.keys(account).sort(), [
            "email",
            "id",
            "isActive",
            "name",
            "role",
          ]);
        for (const role of ["admissions", "events"]) {
          await context.db.admin.update({ where: { id: session.admin.id }, data: { role } });
          assert.equal((await context.request("/accounts", undefined, session)).status, 403);
        }
      },
    );
  } finally {
    await context.db.$disconnect();
  }
});
