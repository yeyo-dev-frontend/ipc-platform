import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { Secret, TOTP } from "otpauth";

export const createTotp = (secret, email = "") =>
  new TOTP({
    issuer: "IPC",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });
export function createMfaCrypto(value) {
  if (!/^[a-f0-9]{64}$/i.test(value ?? "")) throw new Error("Configura MFA_ENCRYPTION_KEY.");
  const key = Buffer.from(value, "hex");
  return {
    generate: () => new Secret({ size: 20 }).base32,
    encrypt(secret, adminId) {
      const iv = randomBytes(12);
      const cipher = createCipheriv("aes-256-gcm", key, iv);
      cipher.setAAD(Buffer.from(adminId));
      const data = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
      return [iv, cipher.getAuthTag(), data].map((part) => part.toString("base64url")).join(".");
    },
    decrypt(value, adminId) {
      const [iv, tag, data] = value.split(".").map((part) => Buffer.from(part, "base64url"));
      const cipher = createDecipheriv("aes-256-gcm", key, iv);
      cipher.setAAD(Buffer.from(adminId));
      cipher.setAuthTag(tag);
      return Buffer.concat([cipher.update(data), cipher.final()]).toString("utf8");
    },
    step(secret, code, lastStep) {
      if (!/^\d{6}$/.test(code)) return null;
      const now = Date.now();
      const delta = createTotp(secret).validate({ token: code, timestamp: now, window: 1 });
      const step = Math.floor(now / 30000) + delta;
      return delta !== null && (lastStep === null || step > lastStep) ? step : null;
    },
  };
}
