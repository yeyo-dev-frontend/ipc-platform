import { Badge } from "../../atoms/badge";
import { Paragraph } from "../../atoms/paragraph";
import { Title } from "../../atoms/titles";

export function EventsSummaryCard({ title, detail, badge }) {
  return (
    <article className="rounded-[10px] border border-line bg-white p-6">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Title level="h3" text={title} />
        <Badge text={badge} />
      </div>
      <Paragraph text={detail} />
    </article>
  );
}
