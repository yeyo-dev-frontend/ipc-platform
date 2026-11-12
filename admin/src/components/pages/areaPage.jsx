import { FiArrowLeft } from "react-icons/fi";
import { Link } from "../atoms/links";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";
import { AccountInvitations } from "../organisms/admin/accountInvitations";
import { AdmissionsPanel } from "../organisms/admissions/admissionsPanel";
import { EventsPanel } from "../organisms/events/eventsPanel";

export function AreaPage({ area }) {
  const { Icon, title, description, slug } = area;
  return (
    <section>
      <Link to="/" className="mt-4">
        <FiArrowLeft aria-hidden="true" />
        Volver al escritorio
      </Link>
      <div className="mt-6 rounded-[10px] border border-line bg-white p-6">
        <Icon aria-hidden="true" className="text-2xl text-blue-dark" />
        <Title level="h2" text={title} className="mt-3 mb-1" />
        <Paragraph text={description} />
        {area.pending && (
          <Paragraph
            size="small"
            className="mt-2"
            text="Esta área está en preparación."
          />
        )}
      </div>
      {slug === "cuentas" && <AccountInvitations />}
      {slug === "admision" && <AdmissionsPanel />}
      {slug === "eventos" && <EventsPanel />}
    </section>
  );
}
