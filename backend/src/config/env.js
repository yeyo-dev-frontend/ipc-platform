import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { z } from "zod";

export function loadConfig() {
  try {
    loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const result = z
    .object({
      NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
      DATABASE_URL: z.string().url(),
      JWT_SECRET: z.string().regex(/^[a-f0-9]{64}$/i),
      MFA_ENCRYPTION_KEY: z.string().regex(/^[a-f0-9]{64}$/i),
      PORT: z.coerce.number().int().min(1).max(65535).default(3000),
      ADMIN_ORIGIN: z.string().url().default("http://127.0.0.1:3000"),
    })
    .safeParse(process.env);
  if (!result.success)
    throw new Error(
      "Configuración inválida; revisa DATABASE_URL, JWT_SECRET, MFA_ENCRYPTION_KEY, PORT y ADMIN_ORIGIN.",
    );
  const env = result.data;
  if (env.MFA_ENCRYPTION_KEY.toLowerCase() === env.JWT_SECRET.toLowerCase()) {
    throw new Error("MFA_ENCRYPTION_KEY debe ser independiente de JWT_SECRET.");
  }
  const origin = new URL(env.ADMIN_ORIGIN);
  if (!["postgres:", "postgresql:"].includes(new URL(env.DATABASE_URL).protocol)) {
    throw new Error("DATABASE_URL debe apuntar a PostgreSQL.");
  }
  if (origin.origin !== env.ADMIN_ORIGIN || !["http:", "https:"].includes(origin.protocol)) {
    throw new Error("ADMIN_ORIGIN debe ser un origen HTTP(S) sin ruta ni barra final.");
  }
  // El despliegue requiere revisar HTTPS, cookies y recuperación operativa.
  if (env.NODE_ENV === "production") {
    throw new Error(
      "Autenticación en desarrollo: revisar despliegue seguro antes de habilitar producción.",
    );
  }
  return {
    databaseUrl: env.DATABASE_URL,
    port: env.PORT,
    origin: env.ADMIN_ORIGIN,
    production: false,
    jwtSecret: env.JWT_SECRET,
    mfaEncryptionKey: env.MFA_ENCRYPTION_KEY,
  };
}
