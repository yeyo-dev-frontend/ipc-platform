import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";

function AdmissionsStudyMode({ study }) {
  return (
    <div className="mt-14 grid gap-7 border-t border-neutral-white/25 pt-8 sm:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
      <div>
        <Title
          level="h3"
          size="compact"
          variant="primary"
          weight="bold"
          className="font-hani"
        >
          Modalidad de estudio
        </Title>
        <Paragraph
          size="small"
          variant="inherit"
          className="mt-3 max-w-sm leading-relaxed text-neutral-white/70"
        >
          {study.description}
        </Paragraph>
      </div>
      <dl className="flex flex-wrap items-start gap-x-12 gap-y-6 sm:gap-x-16">
        <div>
          <dt className="text-xs text-neutral-white/70">Modalidad</dt>
          <dd className="mt-2 font-hani text-3xl font-bold text-blue-light">
            {study.modality}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-neutral-white/70">Turnos disponibles</dt>
          <dd className="mt-2 font-hani text-2xl sm:text-3xl">
            {study.shifts.join(" · ")}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export { AdmissionsStudyMode };
