import { spawnSync } from "node:child_process";
import { loadConfig } from "../src/config/env.js";

// Base exclusiva de pruebas, sin reutilizar ipc_backend_dev ni permitir hosts remotos.
const source = new URL(loadConfig().databaseUrl);
if (!["localhost", "127.0.0.1", "[::1]"].includes(source.hostname)) {
  throw new Error("Las pruebas requieren PostgreSQL local.");
}
source.pathname = "/ipc_backend_auth_test";
source.search = "";
const env = {
  ...process.env,
  NODE_ENV: "test",
  DATABASE_URL: source.href,
  TEST_DATABASE_URL: source.href,
};
for (const args of [
  ["node_modules/prisma/build/index.js", "migrate", "deploy"],
  [
    "--test",
    "--test-concurrency=1",
    "tests/auth.test.js",
    "tests/jwt.test.js",
    "tests/mfa.test.js",
    "tests/middlewareScope.test.js",
    "tests/readInput.test.js",
  ],
]) {
  const result = spawnSync(process.execPath, args, {
    cwd: new URL("../", import.meta.url),
    env,
    stdio: "inherit",
  });
  if (result.error || result.status !== 0) {
    process.exitCode = result.status || 1;
    break;
  }
}
