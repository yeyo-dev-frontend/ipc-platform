import { Link } from "react-router-dom";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";

export function AreaCard({ path, Icon, title, description }) {
  return (
    <article className="rounded-[10px] border border-line bg-white p-6 transition-colors hover:border-blue-dark/60">
      <Link
        to={path}
        className="block rounded-md focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
      >
        <Icon aria-hidden="true" className="text-2xl text-blue-dark" />
        <Title level="h3" text={title} className="mt-4 mb-1" />
        <Paragraph text={description} />
      </Link>
    </article>
  );
}
