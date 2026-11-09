import { FiCalendar, FiFileText, FiInbox, FiLogOut } from "react-icons/fi";
import { Brand } from "../molecules/brand";
import { Button } from "../atoms/button";

const areas = [
  [FiCalendar, "Eventos", "Agenda, capacitaciones y conferencias."],
  [FiInbox, "Admisión", "Consultas recibidas desde el sitio web."],
  [FiFileText, "Contenido", "Información e imágenes institucionales."],
];
export function WorkspacePage({ onExit }) {
  return (
    <div className="workspace">
      <header>
        <Brand />
        <Button variant="light" onClick={onExit}>
          <FiLogOut />
          Salir de la muestra
        </Button>
      </header>
      <main>
        <p className="role">Administrador principal · Vista de muestra</p>
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
