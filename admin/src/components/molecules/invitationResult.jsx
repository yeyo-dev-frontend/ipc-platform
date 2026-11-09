import { useState } from "react";
import { Button } from "../atoms/button";

const roles = {
  admin: "Administración",
  admissions: "Admisión",
  events: "Eventos",
};

export function InvitationResult({ invitation }) {
  const [visible, setVisible] = useState(true);
  const { admin, activationToken } = invitation;
  return (
    <article className="invitation-result" role="status">
      <h3>Código de activación emitido</h3>
      <p>
        Cuenta pendiente para <strong>{admin.name}</strong> ({admin.email}) con
        rol <strong>{roles[admin.role]}</strong>. Comparte este código por un
        canal privado tras verificar su identidad; vence en 24 horas y solo se
        muestra esta vez.
      </p>
      {visible && (
        <p className="recovery-codes">
          <code>{activationToken}</code>
        </p>
      )}
      <Button variant="link" onClick={() => setVisible((current) => !current)}>
        {visible ? "Ocultar código" : "Mostrar código"}
      </Button>
    </article>
  );
}
