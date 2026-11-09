import { useState } from "react";
import { Button } from "../atoms/button";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";

const roles = {
  admin: "Administración",
  admissions: "Admisión",
  events: "Eventos",
};

export function InvitationResult({ invitation }) {
  const [visible, setVisible] = useState(true);
  const { admin, activationToken } = invitation;
  return (
    <article
      className="mb-4 rounded-[10px] border border-line bg-white p-6"
      role="status"
    >
      <Title level="h3" className="mb-1">
        Código de activación emitido
      </Title>
      <Paragraph>
        Cuenta pendiente para <strong>{admin.name}</strong> ({admin.email}) con
        rol <strong>{roles[admin.role]}</strong>. Comparte este código por un
        canal privado tras verificar su identidad; vence en 24 horas y solo se
        muestra esta vez.
      </Paragraph>
      {visible && (
        <Paragraph className="my-4.5 grid gap-1 rounded-[7px] bg-soft p-3.5">
          <code className="wrap-anywhere text-ink">{activationToken}</code>
        </Paragraph>
      )}
      <Button
        variant="link"
        text={visible ? "Ocultar código" : "Mostrar código"}
        onClick={() => setVisible((current) => !current)}
      />
    </article>
  );
}
