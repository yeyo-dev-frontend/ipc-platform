import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Image } from "@ipc/image";

export function AuthenticatorSetup({ provisioningUri, secret }) {
  const [source, setSource] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    if (!provisioningUri?.startsWith("otpauth://totp/")) {
      setFailed(true);
      return;
    }
    QRCode.toDataURL(provisioningUri, { margin: 4, scale: 6 }).then(
      (url) => {
        if (active) setSource(url);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, [provisioningUri]);

  return (
    <>
      <p>
        {failed
          ? "No se pudo mostrar el QR. Usa la clave manual para configurar el autenticador."
          : "En Authy u otra aplicación autenticadora, añade una cuenta y escanea este QR."}
      </p>
      <Image
        src={failed ? null : source}
        alt="QR para configurar el autenticador de IPC"
        className="authenticator-qr"
        loading="eager"
        onError={() => setFailed(true)}
      />
      <details open={failed || undefined}>
        <summary>Introducir la clave manualmente</summary>
        <code>{secret}</code>
      </details>
    </>
  );
}
