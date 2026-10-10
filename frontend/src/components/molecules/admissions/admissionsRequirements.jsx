import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";

function AdmissionsRequirements({ items }) {
  return (
    <div>
      <Paragraph
        size="small"
        variant="inherit"
        className="mb-3 text-blue-light"
      >
        Antes de empezar
      </Paragraph>
      <Title level="h3" variant="primary" weight="bold" className="font-hani">
        Ten a mano tus documentos
      </Title>
      <ul className="mt-7 divide-y divide-neutral-white/15 border-y border-neutral-white/15">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4 py-5">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-light"
            />
            <Paragraph
              size="base"
              variant="inherit"
              className="leading-relaxed text-neutral-white/85"
            >
              {item}
            </Paragraph>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { AdmissionsRequirements };
