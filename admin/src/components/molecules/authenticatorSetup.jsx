import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Image } from "@ipc/image";
import { Paragraph } from "../atoms/paragraph";

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
      <Paragraph>
        {failed
          ? "No se pudo mostrar el QR. Usa la clave manual para configurar el autenticador."
          : "En Authy u otra aplicación autenticadora, añade una cuenta y escanea este QR."}
      </Paragraph>
      <Image
        src={failed ? null : source}
        alt="QR para configurar el autenticador de IPC"
        className="my-4 aspect-square w-[min(100%,240px)] bg-blue-dark"
        imageClassName="[image-rendering:pixelated]"
        loading="eager"
        onError={() => setFailed(true)}
      />
      <details open={failed || undefined}>
        <summary className="cursor-pointer text-blue-dark">
          Introducir la clave manualmente
        </summary>
        <code className="wrap-anywhere">{secret}</code>
      </details>
    </>
  );
}
