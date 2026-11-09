import {
  FiCalendar,
  FiFileText,
  FiInbox,
  FiShield,
  FiUsers,
} from "react-icons/fi";

export const WORKSPACE_AREAS = [
  {
    slug: "cuentas",
    path: "/cuentas",
    Icon: FiUsers,
    title: "Cuentas y accesos",
    description: "Invitaciones de personal, activación y control de acceso.",
    roles: ["admin"],
  },
  {
    slug: "eventos",
    path: "/eventos",
    Icon: FiCalendar,
    title: "Eventos",
    description: "Agenda, capacitaciones, conferencias y recursos multimedia.",
    roles: ["admin", "events"],
  },
  {
    slug: "admision",
    path: "/admision",
    Icon: FiInbox,
    title: "Admisión",
    description: "Consultas recibidas desde el sitio web, notas y seguimiento.",
    roles: ["admin", "admissions"],
  },
  {
    slug: "contenido",
    path: "/contenido",
    Icon: FiFileText,
    title: "Contenido",
    description: "Información institucional, carreras, documentos e historial.",
    roles: ["admin"],
  },
  {
    slug: "auditoria",
    path: "/auditoria",
    Icon: FiShield,
    title: "Auditoría",
    description:
      "Registro de operaciones administrativas y eventos de seguridad.",
    roles: ["admin"],
  },
];

export const ROLE_LABELS = {
  admin: "Administración",
  admissions: "Admisión",
  events: "Eventos",
};
