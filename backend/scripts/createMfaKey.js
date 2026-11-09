import { readFile, writeFile, chmod } from "node:fs/promises";
import { randomBytes } from "node:crypto";

const path = new URL("../.env", import.meta.url);
try {
  const current = await readFile(path, "utf8");
  const assignment = /^MFA_ENCRYPTION_KEY=(.*)$/m.exec(current);
  if (assignment?.[1].trim()) {
    console.log("MFA_ENCRYPTION_KEY ya está configurada; no se modifica.");
  } else {
    const line = "MFA_ENCRYPTION_KEY=" + randomBytes(32).toString("hex");
    const updated = assignment
      ? current.replace(/^MFA_ENCRYPTION_KEY=.*$/m, line)
      : current + "\n" + line + "\n";
    await writeFile(path, updated, { mode: 0o600 });
    await chmod(path, 0o600);
    console.log("Clave de cifrado MFA generada en backend/.env; su valor no se muestra.");
  }
} catch {
  console.error(
    "No se pudo configurar la clave. Crea backend/.env desde .env.example y revisa permisos.",
  );
  process.exitCode = 1;
}
