import { useState } from "react";
import {
  getPastEvents,
  getUpcomingEvents,
  isPastEvent,
} from "@/data/events/evenst";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  buildWeek,
  todayKey,
  toDayKey,
} from "../../../utils/calendarDates";

/**
 * Agrupa los eventos por día. Un evento de varios días aparece en cada uno.
 * Es una función pura fuera del hook: así el React Compiler la entiende sin problemas.
 */
function groupEventsByDay(events) {
  const map = {};

  for (const event of events) {
    const startKey = toDayKey(event.date);
    const endKey = toDayKey(event.endDate ?? event.date);

    let key = startKey;
    for (let guard = 0; key <= endKey && guard < 62; guard += 1) {
      if (!map[key]) map[key] = [];
      map[key].push({ event, isStart: key === startKey });
      key = addDays(key, 1);
    }
  }

  for (const list of Object.values(map)) {
    list.sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
  }

  return map;
}

/**
 * Estado y datos derivados del calendario de eventos.
 * Recibe la lista de eventos por parámetro: hoy viene de una lista estática,
 * mañana puede venir de una API sin tocar la interfaz.
 *
 * No usa useMemo / useCallback a propósito: el React Compiler memoiza solo,
 * y mezclar ambos genera el aviso "Existing memoization could not be preserved".
 */
function useEventsCalendar(events, initialEventId) {
  const initialEvent = events.find((e) => e.id === initialEventId);
  const initialKey = initialEvent ? toDayKey(initialEvent.date) : null;

  const [view, setView] = useState("month"); // "day" | "week" | "month"
  const [cursor, setCursor] = useState(initialKey ?? todayKey());
  const [selectedDay, setSelectedDay] = useState(initialKey);
  const [selectedId, setSelectedId] = useState(initialEvent?.id ?? null);
  const [listMode, setListMode] = useState(
    initialEvent && isPastEvent(initialEvent) ? "past" : "upcoming",
  );

  const today = todayKey();

  const eventsByDay = groupEventsByDay(events);
  const upcoming = getUpcomingEvents(events);
  const past = getPastEvents(events);
  const listEvents = listMode === "upcoming" ? upcoming : past;

  const cells = view === "week" ? buildWeek(cursor) : buildMonthGrid(cursor);

  function shift(direction) {
    if (view === "month") setCursor(addMonths(cursor, direction));
    else if (view === "week") setCursor(addDays(cursor, 7 * direction));
    else setCursor(addDays(cursor, direction));
  }

  function goToday() {
    const key = todayKey();
    setCursor(key);
    setSelectedDay(key);
    setSelectedId(null);
  }

  function selectDay(key) {
    setCursor(key);
    setSelectedDay(key);
    setSelectedId(null);
  }

  function selectEvent(event) {
    const key = toDayKey(event.date);
    setCursor(key);
    setSelectedDay(key);
    setSelectedId(event.id);
  }

  // En vista "día" se muestra el día del cursor; en las demás, el día seleccionado.
  const agendaKey = view === "day" ? cursor : selectedDay;
  const agendaEntries = agendaKey ? (eventsByDay[agendaKey] ?? []) : [];

  return {
    view,
    setView,
    cursor,
    today,
    cells,
    eventsByDay,
    upcoming,
    past,
    listMode,
    setListMode,
    listEvents,
    selectedDay,
    selectedId,
    agendaKey,
    agendaEntries,
    shift,
    goToday,
    selectDay,
    selectEvent,
  };
}

export { useEventsCalendar };
