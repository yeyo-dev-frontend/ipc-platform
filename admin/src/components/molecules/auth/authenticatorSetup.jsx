import { useEffect, useState } from "react";
import { Image } from "@ipc/image";
import { renderQrWithLogo } from "../../../services/renderQrWithLogo";
import { Code } from "../../atoms/code";
import { Paragraph } from "../../atoms/paragraph";

export function AuthenticatorSetup({ provisioningUri, secret }) {
  const [source, setSource] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    if (!provisioningUri?.startsWith("otpauth://totp/")) {
      setFailed(true);
      return;
    }
    renderQrWithLogo(provisioningUri).then(
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
      <Paragraph
        text={
          failed
            ? "No se pudo mostrar el QR. Usa la clave manual para configurar el autenticador."
            : "En Authy u otra aplicación autenticadora, añade una cuenta y escanea este QR."
        }
      />
      <Image
        src={failed ? null : source}
        alt="QR para configurar el autenticador de IPC"
        className="my-4 aspect-square w-[min(100%,240px)] rounded-xl border border-line bg-blue-dark shadow-xs"
        loading="eager"
        onError={() => setFailed(true)}
      />
      <details open={failed || undefined}>
        <summary className="cursor-pointer">
          <Paragraph
            as="span"
            variant="institutional"
            weight="semi"
            text="Introducir la clave manualmente"
          />
        </summary>
        <Code text={secret} className="mt-1.5 block" />
      </details>
    </>
  );
}
