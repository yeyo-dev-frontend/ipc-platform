import { AdmissionsSummaryCard } from "../../molecules/admissions/admissionsSummaryCard";

export function AdmissionsPanel() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <AdmissionsSummaryCard
        title="Consultas recibidas"
        badge="Admisión"
        detail="Revisión de solicitudes enviadas desde el formulario web y asignación de seguimiento."
      />
      <AdmissionsSummaryCard
        title="Notas y orientación"
        badge="Seguimiento"
        detail="Registro interno de llamadas, estado de atención y orientación de postulantes."
      />
    </div>
  );
}
