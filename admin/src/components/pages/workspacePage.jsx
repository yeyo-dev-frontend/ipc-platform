import { useState } from "react";
import {
  FiCalendar,
  FiFileText,
  FiInbox,
  FiLogOut,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { Button } from "../atoms/button";
import { Brand } from "../molecules/brand";
import { AccountInvitations } from "../organisms/accountInvitations";

const areas = [
  [
    FiUsers,
    "Cuentas y accesos",
    "Invitaciones de personal, activación y control de acceso.",
    ["admin"],
  ],
  [
    FiCalendar,
    "Eventos",
    "Agenda, capacitaciones, conferencias y recursos multimedia.",
    ["admin", "events"],
  ],
  [
    FiInbox,
    "Admisión",
    "Consultas recibidas desde el sitio web, notas y seguimiento.",
    ["admin", "admissions"],
  ],
  [
    FiFileText,
    "Contenido",
    "Información institucional, carreras, documentos e historial.",
    ["admin"],
  ],
  [
    FiShield,
    "Auditoría",
    "Registro de operaciones administrativas y eventos de seguridad.",
    ["admin"],
  ],
];
const roles = {
  admin: "Administración",
  admissions: "Admisión",
  events: "Eventos",
};

export function WorkspacePage({ admin, onLogout }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const visibleAreas = areas.filter(([, , , allowed]) =>
    allowed.includes(admin.role),
  );

  async function exit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await onLogout();
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  }

  return (
    <div className="workspace">
      <header>
        <Brand />
        <Button variant="light" data-logout disabled={busy} onClick={exit}>
          <FiLogOut aria-hidden="true" />
          {busy ? "Cerrando sesión…" : "Cerrar sesión"}
        </Button>
      </header>
      <main>
        <p className="role">
          {admin.name} · {roles[admin.role]}
        </p>
        <h1>Panel administrativo</h1>
        {error && <p role="alert">{error}</p>}
        <h2>Áreas de trabajo</h2>
        <div className="areas">
          {visibleAreas.map(([Icon, title, text]) => (
            <article key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        {admin.role === "admin" && <AccountInvitations />}
      </main>
    </div>
  );
}
