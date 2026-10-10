/**
 * Enlaces para que cada visitante agregue un evento a SU calendario.
 *
 * - Google Calendar: URL con los datos del evento (sin API, sin login, gratis).
 * - Archivo .ics: lo abren Apple Calendar, Outlook y también Google Calendar.
 *
 * Una vez que el evento está en el calendario del usuario, es Google/Apple quien
 * le envía las notificaciones al teléfono según sus recordatorios.
 */

const TWO_HOURS = 2 * 60 * 60 * 1000;
const CALENDAR_TZ = "America/Lima";

const getEnd = (event) =>
  event.endDate
    ? new Date(event.endDate)
    : new Date(new Date(event.date).getTime() + TWO_HOURS);

/** 2026-11-10T14:00:00.000Z -> 20261110T140000Z */
const toUtcStamp = (date) =>
  new Date(date)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

function buildDescription(event) {
  const lines = [event.shortDescription ?? ""];
  if (event.highlights?.length) {
    lines.push("", ...event.highlights.map((item) => `• ${item}`));
  }
  return lines.join("\n").trim();
}

export function buildGoogleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toUtcStamp(event.date)}/${toUtcStamp(getEnd(event))}`,
    details: buildDescription(event),
    location: event.location ?? "",
    ctz: CALENDAR_TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ---------- .ics ---------- */

const encoder = new TextEncoder();

const escapeText = (text = "") =>
  String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/** Las líneas de un .ics no deben pasar de 75 bytes; se continúan con un espacio. */
function foldLine(line) {
  const chunks = [];
  let current = "";
  let bytes = 0;
  let limit = 75;

  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > limit) {
      chunks.push(current);
      current = char;
      bytes = size;
      limit = 74;
    } else {
      current += char;
      bytes += size;
    }
  }
  chunks.push(current);
  return chunks.join("\r\n ");
}

function buildVEvent(event, stamp, host) {
  const reminder = (trigger, text) => [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(text)}`,
    `TRIGGER:${trigger}`,
    "END:VALARM",
  ];

  return [
    "BEGIN:VEVENT",
    `UID:${event.id}@${host}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toUtcStamp(event.date)}`,
    `DTEND:${toUtcStamp(getEnd(event))}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(buildDescription(event))}`,
    `LOCATION:${escapeText(event.location)}`,
    ...reminder("-P1D", `Mañana: ${event.title}`),
    ...reminder("-PT1H", `En 1 hora: ${event.title}`),
    "END:VEVENT",
  ];
}

export function buildIcs(events) {
  const list = Array.isArray(events) ? events : [events];
  const stamp = toUtcStamp(new Date());
  const host =
    typeof window !== "undefined"
      ? window.location.hostname || "eventos"
      : "eventos";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eventos//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...list.flatMap((event) => buildVEvent(event, stamp, host)),
    "END:VCALENDAR",
  ];

  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

/** Descarga un evento (o varios) como archivo .ics. */
export function downloadIcs(events, filename) {
  const list = Array.isArray(events) ? events : [events];
  const blob = new Blob([buildIcs(list)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename ?? (list.length === 1 ? `${list[0].id}.ics` : "eventos.ics");
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
