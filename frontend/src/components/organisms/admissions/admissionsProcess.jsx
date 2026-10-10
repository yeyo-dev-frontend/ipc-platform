import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";
import { Image } from "@/components/atoms/image";
import { BannerBgCurve } from "@/components/molecules/shared/curvePath";
import { AdmissionsRequirements } from "@/components/molecules/admissions/admissionsRequirements";
import { AdmissionsProcessSteps } from "@/components/molecules/admissions/admissionsProcessSteps";
import {
  admissionRequirements,
  admissionSteps,
  admissionStudy,
  admissionProcessImages,
} from "@/data/admissions/process";

function AdmissionsProcess() {
  return (
    <section
      aria-labelledby="admissions-process-title"
      className="admissions-process relative isolate bg-charcoal pb-20 font-poppins sm:pb-28"
    >
      <div className="text-neutral-white">
        <div className="mx-auto w-[88%] max-w-6xl py-16 sm:py-20 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
            <div>
              <Paragraph
                size="small"
                variant="inherit"
                className="mb-5 flex items-center gap-3 text-orange"
              >
                <span aria-hidden="true" className="h-px w-8 bg-orange" />
                Guía de admisión
              </Paragraph>
              <Title
                id="admissions-process-title"
                level="h2"
                size="hero"
                variant="primary"
                weight="bold"
                className="admissions-process__title font-hani"
              >
                Tu próximo paso,
                <br />
                <span className="text-blue-light">empieza aquí.</span>
              </Title>
            </div>
            <div>
              <Image
                src={admissionProcessImages.students.src}
                alt={admissionProcessImages.students.alt}
                className="aspect-16/8 w-full"
                imageClassName="object-[center_40%]"
              />
              <Paragraph
                size="base"
                variant="inherit"
                className="mt-5 leading-relaxed text-neutral-white/75"
              >
                Conoce los documentos que necesitas y los pasos para postular al
                Instituto Privado Celendín.
              </Paragraph>
            </div>
          </div>

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <div>
              <AdmissionsRequirements items={admissionRequirements} />
              <Image
                src={admissionProcessImages.preparation.src}
                alt={admissionProcessImages.preparation.alt}
                className="mt-7 aspect-16/8 w-full"
              />
            </div>
            <AdmissionsProcessSteps items={admissionSteps} />
          </div>

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
                {admissionStudy.description}
              </Paragraph>
            </div>
            <dl className="flex flex-wrap items-start gap-x-12 gap-y-6 sm:gap-x-16">
              <div>
                <dt className="text-xs text-neutral-white/70">Modalidad</dt>
                <dd className="mt-2 font-hani text-3xl font-bold text-blue-light">
                  {admissionStudy.modality}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-white/70">
                  Turnos disponibles
                </dt>
                <dd className="mt-2 font-hani text-2xl sm:text-3xl">
                  {admissionStudy.shifts.join(" · ")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <BannerBgCurve
        design={6}
        color="var(--color-neutral-white)"
        accentColor="var(--color-blue-dark)"
        height="h-20 sm:h-28"
        className="-bottom-px"
      />
    </section>
  );
}

export { AdmissionsProcess };
