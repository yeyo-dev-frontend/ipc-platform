import { spawnSync } from "node:child_process";

const [target, ...extra] = process.argv.slice(2);
if (!["admin", "frontend", "backend"].includes(target) || extra.length) {
  console.error("Uso: pnpm dev: admin | frontend | backend");
  process.exitCode = 1;
} else {
  const run = spawnSync("pnpm", ["run", `dev:${target}`], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  process.exitCode = run.status ?? 1;
}
