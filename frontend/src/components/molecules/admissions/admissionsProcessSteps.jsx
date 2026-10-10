import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";

function AdmissionsProcessSteps({ items }) {
  return (
    <ol
      aria-label="Pasos del proceso de admisión"
      className="border-t border-neutral-white/25"
    >
      {items.map(({ title, description }, index) => (
        <li
          key={title}
          className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-neutral-white/25 py-6 sm:grid-cols-[4rem_1fr] sm:gap-6 sm:py-7"
        >
          <span
            aria-hidden="true"
            className="font-hani text-4xl leading-none text-blue-light sm:text-5xl"
          >
            {`0${index + 1}`}
          </span>
          <div>
            <Title
              level="h3"
              variant="primary"
              weight="bold"
              className="font-hani leading-snug"
            >
              {title}
            </Title>
            <Paragraph
              size="small"
              variant="inherit"
              className="mt-2 max-w-md leading-relaxed text-neutral-white/70"
            >
              {description}
            </Paragraph>
          </div>
        </li>
      ))}
    </ol>
  );
}

export { AdmissionsProcessSteps };
