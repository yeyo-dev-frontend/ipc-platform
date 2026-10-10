import { toDayKey } from "../../../utils/calendarDates";
import alfombra from "@assets/images/events/alfombra-ipc.webp";
import encuentro1 from "@assets/images/events/encuentro-img1.webp";
import encuentro2 from "@assets/images/events/encuentro-img-2.webp";
import encuentro3 from "@assets/images/events/encuentro-img-3.webp";
import feria from "@assets/images/events/feria.webp";
import feriaIgm3 from "@assets/images/events/feria-igm-3.webp";
import graduates1 from "@assets/images/events/graduates-img1.webp";
import graduates2 from "@assets/images/events/graduates-img2.webp";
import taller from "@assets/images/events/taller.webp";
import tallerImg2 from "@assets/images/events/taller-img2.webp";

export const EVENTS = [
  /* ---------------- Realizados ---------------- */
  {
    id: "graduacion-2026",
    category: "Graduación",
    title: "Ceremonia de Graduación",
    shortDescription:
      "Celebramos junto a familias y docentes el logro de nuestros nuevos egresados.",
    longDescription:
      "Una ceremonia emotiva donde los nuevos egresados recibieron sus diplomas en compañía de sus familias, docentes y autoridades. Hubo discursos de la promoción, entrega de reconocimientos a los mejores desempeños y un brindis final para celebrar este paso importante.",
    highlights: [
      "Entrega de diplomas",
      "Reconocimientos académicos",
      "Palabras de la promoción",
      "Brindis y fotos de recuerdo",
    ],
    date: "2026-04-09T16:00:00-05:00",
    endDate: "2026-04-09T19:00:00-05:00",
    location: "Lima, Perú",
    image: graduates1,
    featured: true,
  },
  {
    id: "alfombra-fiestas-patronales-2026",
    category: "Cultural",
    title: "Elaboración de Alfombra por las Fiestas Patronales",
    shortDescription:
      "Estudiantes y comunidad elaboraron una alfombra artesanal en honor a las festividades patronales de la provincia.",
    longDescription:
      "Estudiantes, docentes y vecinos se unieron para elaborar una alfombra artesanal en honor a las festividades patronales de la provincia. Con flores, aserrín teñido y otros materiales tradicionales, se diseñó y armó la obra que luego recibió la procesión. Una forma de mantener viva la identidad y la devoción de nuestra comunidad.",
    highlights: [
      "Tradición viva",
      "Trabajo comunitario",
      "Diseño con materiales naturales",
      "Identidad y cultura local",
    ],
    date: "2026-05-14T06:00:00-05:00",
    endDate: "2026-05-14T14:00:00-05:00",
    location: "Cusco, Perú",
    image: alfombra,
    featured: true,
  },
  {
    id: "encuentro-universitario-2026",
    category: "Encuentro",
    title: "Encuentro Universitario",
    shortDescription:
      "Un espacio para que estudiantes de distintas universidades se conozcan, compartan experiencias y formen redes.",
    longDescription:
      "Estudiantes de distintas universidades se reunieron para intercambiar experiencias académicas, conocer proyectos de otras casas de estudio y construir redes de apoyo. Hubo dinámicas de integración, conversatorios con egresados y un espacio libre de networking.",
    highlights: [
      "Integración entre universidades",
      "Conversatorios con egresados",
      "Networking estudiantil",
      "Intercambio de experiencias",
    ],
    date: "2026-06-27T09:00:00-05:00",
    endDate: "2026-06-27T17:00:00-05:00",
    location: "Arequipa, Perú",
    image: encuentro1,
    featured: true,
  },
  {
    id: "seminario-gestion-2026",
    category: "Seminario",
    title: "Seminario de Gestión Educativa",
    shortDescription:
      "Directivos y coordinadores compartieron estrategias de planificación, evaluación y mejora continua.",
    longDescription:
      "Un seminario para directivos y coordinadores académicos centrado en planificación estratégica, evaluación institucional y mejora continua. Se analizaron casos de instituciones que lograron resultados sostenidos y se trabajaron planes de acción por equipos.",
    highlights: [
      "Casos de éxito",
      "Planes de acción",
      "Indicadores de calidad",
      "Constancia de participación",
    ],
    date: "2026-07-15T09:00:00-05:00",
    endDate: "2026-07-15T13:00:00-05:00",
    location: "Lima, Perú",
    image: encuentro2,
    featured: false,
  },
  {
    id: "taller-habilidades-2026",
    category: "Taller",
    title: "Taller de Habilidades Prácticas",
    shortDescription:
      "Jornada práctica en grupos pequeños para aprender haciendo, con guía de facilitadores.",
    longDescription:
      "Un taller de trabajo en grupos reducidos donde los participantes aprendieron haciendo. Con la guía de facilitadores, resolvieron ejercicios aplicados, recibieron retroalimentación inmediata y se llevaron material para seguir practicando.",
    highlights: [
      "Aprender haciendo",
      "Grupos reducidos",
      "Retroalimentación en vivo",
      "Material de trabajo incluido",
    ],
    date: "2026-08-20T15:00:00-05:00",
    endDate: "2026-08-20T19:00:00-05:00",
    location: "Piura, Perú",
    image: taller,
    featured: true,
  },
  {
    id: "feria-emprendimiento-2026",
    category: "Feria",
    title: "Feria de Emprendimiento",
    shortDescription:
      "Presenta tu idea, conoce a otros emprendedores y recibe mentoría para llevar tu proyecto al siguiente nivel.",
    longDescription:
      "Más de treinta emprendimientos presentaron sus productos y servicios al público. Hubo mentorías express con empresarios, charlas sobre financiamiento y un espacio de pitch donde los participantes expusieron sus ideas ante posibles aliados.",
    highlights: [
      "Stands de emprendedores",
      "Mentorías express",
      "Pitch de proyectos",
      "Charlas de financiamiento",
    ],
    date: "2026-09-12T10:00:00-05:00",
    endDate: "2026-09-12T18:00:00-05:00",
    location: "Trujillo, Perú",
    image: feria,
    featured: true,
  },

  /* ---------------- Próximos ---------------- */
  {
    id: "graduacion-promocion-2026",
    category: "Graduación",
    title: "Graduación de Promoción 2026",
    shortDescription:
      "Ceremonia de cierre para la promoción 2026: diplomas, reconocimientos y una noche para celebrar en familia.",
    longDescription:
      "Nos reuniremos para celebrar el cierre de ciclo de la promoción 2026. Habrá entrega de diplomas, reconocimientos a los mejores egresados, palabras de las autoridades y un momento especial para compartir con las familias. Se recomienda llegar con anticipación para ubicarse.",
    highlights: [
      "Entrega de diplomas",
      "Reconocimientos especiales",
      "Acompañamiento de familias",
      "Foto oficial de la promoción",
    ],
    date: "2026-10-22T17:00:00-05:00",
    endDate: "2026-10-22T20:00:00-05:00",
    location: "Lima, Perú",
    image: graduates2,
    featured: false,
  },
  {
    id: "congreso-universitario-2026",
    category: "Congreso",
    title: "Congreso Universitario",
    shortDescription:
      "Tres días de ponencias, mesas de trabajo y encuentros entre estudiantes, docentes y profesionales.",
    longDescription:
      "Durante tres días reuniremos a estudiantes universitarios, docentes y profesionales para compartir ideas, proyectos y tendencias. Habrá ponencias magistrales, mesas de trabajo y espacios de networking pensados para que te lleves contactos y propuestas aplicables. Al finalizar recibirás un certificado de asistencia.",
    highlights: [
      "Ponencias magistrales",
      "Mesas de trabajo",
      "Networking",
      "Certificado de asistencia",
    ],
    date: "2026-11-10T09:00:00-05:00",
    endDate: "2026-11-12T18:00:00-05:00",
    location: "Lima, Perú",
    image: encuentro3,
    featured: false,
  },
  {
    id: "taller-liderazgo-2026",
    category: "Taller",
    title: "Taller de Liderazgo",
    shortDescription:
      "Jornada intensiva con casos reales para aprender a comunicar, decidir bajo presión y motivar equipos.",
    longDescription:
      "Una jornada intensiva donde trabajarás con casos reales de gestión y liderazgo de equipos. A través de dinámicas guiadas aprenderás a comunicar con claridad, tomar decisiones bajo presión y motivar a las personas a tu cargo. El cupo es limitado para garantizar atención personalizada, e incluye material de trabajo y certificado.",
    highlights: [
      "Casos reales",
      "Grupos reducidos",
      "Material incluido",
      "Certificado",
    ],
    date: "2026-12-05T10:00:00-05:00",
    endDate: "2026-12-05T17:00:00-05:00",
    location: "Arequipa, Perú",
    image: tallerImg2,
    featured: false,
  },
  {
    id: "feria-innovacion-2027",
    category: "Feria",
    title: "Feria de Innovación y Emprendimiento 2027",
    shortDescription:
      "Segunda edición de la feria: más stands, más mentorías y un espacio ampliado para presentar tu proyecto.",
    longDescription:
      "Regresamos con una nueva edición de la feria, con más stands, mentorías con empresarios y un espacio ampliado de pitch. Es la oportunidad para exhibir tu emprendimiento, conseguir retroalimentación y conocer posibles aliados. Habrá charlas sobre financiamiento y ventas.",
    highlights: [
      "Más stands de emprendedores",
      "Mentorías con empresarios",
      "Pitch de proyectos",
      "Charlas de financiamiento",
    ],
    date: "2027-03-18T10:00:00-05:00",
    endDate: "2027-03-18T18:00:00-05:00",
    location: "Cusco, Perú",
    image: feriaIgm3,
    featured: false,
  },
];

/* ---------------- Formato de fechas ---------------- */

const TZ = "America/Lima";

const dateFmt = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TZ,
});
const timeFmt = new Intl.DateTimeFormat("es-PE", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: TZ,
});
const dayFmt = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  timeZone: TZ,
});
const monthFmt = new Intl.DateTimeFormat("es-PE", {
  month: "long",
  timeZone: TZ,
});
const yearFmt = new Intl.DateTimeFormat("es-PE", {
  year: "numeric",
  timeZone: TZ,
});

export const formatEventDate = (date) => dateFmt.format(new Date(date));
export const formatEventTime = (date) => timeFmt.format(new Date(date));
export const formatEventDay = (date) => dayFmt.format(new Date(date));
export const formatEventMonth = (date) => monthFmt.format(new Date(date));
export const formatEventYear = (date) => yearFmt.format(new Date(date));

/**
 * "10 de noviembre de 2026 · 9:00 a. m. – 6:00 p. m."  (mismo día)
 * "Del 10 al 12 de noviembre de 2026"                   (varios días)
 */
export function formatEventSchedule(event) {
  const start = event.date;
  const end = event.endDate;

  if (!end) return `${formatEventDate(start)} · ${formatEventTime(start)}`;

  if (toDayKey(start) === toDayKey(end)) {
    return `${formatEventDate(start)} · ${formatEventTime(start)} – ${formatEventTime(end)}`;
  }

  const sameMonth =
    formatEventMonth(start) === formatEventMonth(end) &&
    formatEventYear(start) === formatEventYear(end);

  return sameMonth
    ? `Del ${formatEventDay(start)} al ${formatEventDate(end)}`
    : `Del ${formatEventDate(start)} al ${formatEventDate(end)}`;
}

/* ---------------- Consultas ---------------- */

const byDateAsc = (a, b) => new Date(a.date) - new Date(b.date);
const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

/** Un evento ya pasó cuando terminó (si dura varios días, sigue "vigente" hasta el último). */
export const isPastEvent = (event, now = Date.now()) =>
  new Date(event.endDate ?? event.date).getTime() < now;

/** Eventos que aún no terminaron, del más cercano al más lejano. */
export const getUpcomingEvents = (events = EVENTS, now = Date.now()) =>
  events.filter((e) => !isPastEvent(e, now)).sort(byDateAsc);

/** Eventos que ya terminaron, del más reciente al más antiguo. */
export const getPastEvents = (events = EVENTS, now = Date.now()) =>
  events.filter((e) => isPastEvent(e, now)).sort(byDateDesc);

/** Eventos marcados como destacados (featured: true), los más recientes primero. */
export const getFeaturedEvents = (events = EVENTS) =>
  events.filter((e) => e.featured).sort(byDateDesc);

/** Evento futuro más cercano. Si ya pasaron todos, devuelve el último. */
export function getUpcomingEvent(events = EVENTS) {
  return getUpcomingEvents(events)[0] ?? getPastEvents(events)[0];
}
