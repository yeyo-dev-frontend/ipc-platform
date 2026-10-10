import { useEffect, useMemo, useRef } from "react";
import { useCarousel } from "../globals/useCarrusel";
import { useSlideDirection } from "./useSlidesDirection";
import { EVENTS, getPastEvents, getUpcomingEvents } from "@/data/events/evenst";

function useEventsCarousel() {
  // El carrusel principal solo muestra eventos que aún no terminaron.
  // Si ya no queda ninguno, muestra los últimos para que la sección no quede vacía.
  const events = useMemo(() => {
    const upcoming = getUpcomingEvents(EVENTS);
    return upcoming.length > 0 ? upcoming : getPastEvents(EVENTS).slice(0, 3);
  }, []);

  const carousel = useCarousel({
    slides: events,
    getSrc: (event) => event.image,
    autoplayDelay: 7000,
    transitionMs: 900,
  });

  const { current, next, userPaused, setUserPaused } = carousel;

  // Si hay transición en curso, mostramos el destino
  const index = next !== null ? next : current;
  const event = events[index];
  const direction = useSlideDirection(index, events.length);

  const hovering = useRef(false);

  // En táctil no hay "mouse leave": reanuda el autoplay tras 8 s
  useEffect(() => {
    if (!userPaused || hovering.current) return;
    const t = setTimeout(() => setUserPaused(false), 8000);
    return () => clearTimeout(t);
  }, [userPaused, index, setUserPaused]);

  const hoverHandlers = {
    onMouseEnter: () => {
      hovering.current = true;
      setUserPaused(true);
    },
    onMouseLeave: () => {
      hovering.current = false;
      setUserPaused(false);
    },
  };

  return {
    ...carousel,
    events, // los del carrusel (próximos)
    allEvents: EVENTS, // todos, para el modal del calendario
    event,
    direction,
    hoverHandlers,
  };
}

export { useEventsCarousel };
