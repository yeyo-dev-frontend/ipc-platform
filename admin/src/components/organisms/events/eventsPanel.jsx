import { EventsSummaryCard } from "../../molecules/events/eventsSummaryCard";

export function EventsPanel() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <EventsSummaryCard
        title="Agenda institucional"
        badge="Eventos"
        detail="Programación de conferencias, talleres, ceremonias y fechas destacadas."
      />
      <EventsSummaryCard
        title="Galería y recursos"
        badge="Multimedia"
        detail="Fotografías y material gráfico asociado a las actividades del instituto."
      />
    </div>
  );
}
