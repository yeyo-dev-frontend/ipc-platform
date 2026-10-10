import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";

function AdmissionsContactHeading() {
  return (
    <>
      <Paragraph
        size="small"
        variant="inherit"
        className="mb-4 flex items-center gap-3 text-blue"
      >
        <span aria-hidden="true" className="h-px w-8 bg-orange" /> Estamos para
        orientarte
      </Paragraph>
      <Title
        id="admissions-contact-title"
        level="h2"
        size="hero"
        variant="institutional"
        weight="bold"
        className="font-hani"
      >
        Conversemos sobre
        <br />
        tu futuro.
      </Title>
      <Paragraph
        size="base"
        variant="inherit"
        className="mt-5 max-w-md leading-relaxed text-neutral-dark"
      >
        Cuéntanos qué te gustaría estudiar. Resuelve tus dudas sobre carreras,
        requisitos y turnos.
      </Paragraph>
    </>
  );
}

export { AdmissionsContactHeading };
