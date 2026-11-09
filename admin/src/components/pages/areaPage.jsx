import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";
import { AccountInvitations } from "../organisms/accountInvitations";

export function AreaPage({ area }) {
  const { Icon, title, description, slug } = area;
  return (
    <section>
      <Link
        to="/"
        className="mt-4 inline-flex items-center gap-2 font-poppins text-sm font-bold text-blue-dark hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
      >
        <FiArrowLeft aria-hidden="true" />
        Volver al escritorio
      </Link>
      <div className="mt-6 rounded-[10px] border border-line bg-white p-6">
        <Icon aria-hidden="true" className="text-2xl text-blue-dark" />
        <Title level="h2" text={title} className="mt-3 mb-1" />
        <Paragraph text={description} />
      </div>
      {slug === "cuentas" && <AccountInvitations />}
    </section>
  );
}
