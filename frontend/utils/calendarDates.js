export const TZ = "America/Lima";

// La semana empieza en lunes (convención en Perú).
export const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const keyFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Estos formateadores trabajan sobre fechas "de calendario" (medianoche UTC).
const monthFmt = new Intl.DateTimeFormat("es-PE", {
  month: "long",
  timeZone: "UTC",
});
const yearFmt = new Intl.DateTimeFormat("es-PE", {
  year: "numeric",
  timeZone: "UTC",
});
const shortFmt = new Intl.DateTimeFormat("es-PE", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const longFmt = new Intl.DateTimeFormat("es-PE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const parseKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return { y, m, d };
};

export const keyToUTC = (key) => {
  const { y, m, d } = parseKey(key);
  return new Date(Date.UTC(y, m - 1, d));
};

const utcToKey = (date) => date.toISOString().slice(0, 10);

/** Clave de día ("YYYY-MM-DD") de un instante, en la zona horaria de la institución. */
export function toDayKey(date) {
  const parts = keyFmt.formatToParts(new Date(date));
  const get = (type) => parts.find((p) => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export const todayKey = () => toDayKey(Date.now());

export function addDays(key, n) {
  const date = keyToUTC(key);
  date.setUTCDate(date.getUTCDate() + n);
  return utcToKey(date);
}

/** Suma meses conservando el día (ajustado al último día del mes si hace falta). */
export function addMonths(key, n) {
  const { y, m, d } = parseKey(key);
  const lastDay = new Date(Date.UTC(y, m - 1 + n + 1, 0)).getUTCDate();
  return utcToKey(new Date(Date.UTC(y, m - 1 + n, Math.min(d, lastDay))));
}

export const startOfMonth = (key) => `${key.slice(0, 8)}01`;

export function startOfWeek(key) {
  const dayOfWeek = (keyToUTC(key).getUTCDay() + 6) % 7; // lunes = 0
  return addDays(key, -dayOfWeek);
}

const makeCell = (key, inMonth) => ({
  key,
  day: Number(key.slice(8)),
  inMonth,
});

/** 42 celdas (6 semanas) para la vista de mes. */
export function buildMonthGrid(key) {
  const start = startOfWeek(startOfMonth(key));
  const month = key.slice(0, 7);
  return Array.from({ length: 42 }, (_, i) => {
    const cellKey = addDays(start, i);
    return makeCell(cellKey, cellKey.startsWith(month));
  });
}

/** 7 celdas (lunes a domingo) para la vista de semana. */
export function buildWeek(key) {
  const start = startOfWeek(key);
  return Array.from({ length: 7 }, (_, i) => makeCell(addDays(start, i), true));
}

/** "Lunes, 5 de octubre de 2026" */
export const formatDayLong = (key) => capitalize(longFmt.format(keyToUTC(key)));

/** Título del encabezado según la vista activa. */
export function formatCalendarTitle(view, key) {
  if (view === "day") return formatDayLong(key);

  if (view === "week") {
    const start = startOfWeek(key);
    const end = addDays(start, 6);
    return `${shortFmt.format(keyToUTC(start))} – ${shortFmt.format(keyToUTC(end))} ${yearFmt.format(keyToUTC(end))}`;
  }

  const date = keyToUTC(key);
  return `${capitalize(monthFmt.format(date))} ${yearFmt.format(date)}`;
}
