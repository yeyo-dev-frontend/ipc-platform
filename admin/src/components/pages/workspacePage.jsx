import { FiCalendar, FiFileText, FiInbox } from "react-icons/fi";
import { Brand } from "../molecules/brand";

const areas = [
  [FiCalendar, "Eventos", "Agenda, capacitaciones y conferencias."],
  [FiInbox, "Admisión", "Consultas recibidas desde el sitio web."],
  [FiFileText, "Contenido", "Información e imágenes institucionales."],
];
const roles = {
  admin: "Administración",
  admissions: "Admisión",
  events: "Eventos",
};

export function WorkspacePage({ admin }) {
  return (
    <div className="workspace">
      <header>
        <Brand />
      </header>
      <main>
        <p className="role">
          {admin.name} · {roles[admin.role]}
        </p>
        <h1>Panel administrativo</h1>
        <h2>Áreas de trabajo</h2>
        <div className="areas">
          {areas.map(([Icon, title, text]) => (
            <article key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
