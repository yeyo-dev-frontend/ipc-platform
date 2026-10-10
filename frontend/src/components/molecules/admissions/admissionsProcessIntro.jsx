import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";
import { Image } from "@/components/atoms/image";

function AdmissionsProcessIntro({ image }) {
  return (
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
          src={image.src}
          alt={image.alt}
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
  );
}

export { AdmissionsProcessIntro };
