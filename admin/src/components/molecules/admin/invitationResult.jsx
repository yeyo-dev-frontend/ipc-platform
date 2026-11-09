import { useState } from "react";
import { FiCheck, FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import { ROLE_LABELS } from "../../../data/workspaceAreas";
import { copyText } from "../../../services/copyText";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { IconButton } from "../../atoms/iconButton";
import { Paragraph } from "../../atoms/paragraph";
import { Title } from "../../atoms/titles";

export function InvitationResult({ invitation }) {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const { admin, activationToken } = invitation;

  async function copyCode() {
    if (await copyText(activationToken)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <article
      className="mb-4 rounded-[10px] border border-line bg-white p-6"
      role="status"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <Title level="h3" text="Código de activación emitido" />
        <Badge variant="warning" text="Pendiente de activación · 24 h" />
      </div>
      <Paragraph>
        Cuenta creada para <strong>{admin.name}</strong> ({admin.email}) con rol{" "}
        <strong>{ROLE_LABELS[admin.role]}</strong>. Comparte este código por un
        canal privado tras verificar su identidad; vence en 24 horas y solo se
        muestra esta vez.
      </Paragraph>
      {visible && (
        <div className="my-4.5 flex items-center justify-between gap-3 rounded-[7px] bg-soft p-3.5">
          <code className="wrap-anywhere text-ink">{activationToken}</code>
          <IconButton
            variant="soft"
            label={copied ? "Código copiado" : "Copiar código de activación"}
            onClick={copyCode}
            data-copy-code
            className="shrink-0"
          >
            {copied ? (
              <FiCheck aria-hidden="true" className="text-lg" />
            ) : (
              <FiCopy aria-hidden="true" className="text-lg" />
            )}
          </IconButton>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="link"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <>
              <FiEyeOff aria-hidden="true" /> Ocultar código
            </>
          ) : (
            <>
              <FiEye aria-hidden="true" /> Mostrar código
            </>
          )}
        </Button>
        {copied && (
          <Paragraph
            as="span"
            size="sm"
            variant="institutional"
            weight="semi"
            text="¡Código copiado al portapapeles!"
          />
        )}
      </div>
    </article>
  );
}
