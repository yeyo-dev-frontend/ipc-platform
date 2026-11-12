import { Link } from "../atoms/links";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";

export function AreaCard({ path, Icon, title, description, pending }) {
  return (
    <article className="rounded-[10px] border border-line bg-white p-6 transition-colors hover:border-blue-dark/60">
      <Link to={path} variant="card">
        <Icon aria-hidden="true" className="text-2xl text-blue-dark" />
        <Title level="h3" text={title} className="mt-4 mb-1" />
        {pending && (
          <Paragraph as="span" size="sm" variant="default" text="En preparación" />
        )}
        <Paragraph text={description} />
      </Link>
    </article>
  );
}
