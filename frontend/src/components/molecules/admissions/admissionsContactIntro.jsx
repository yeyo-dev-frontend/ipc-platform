import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";
import { Image } from "@/components/atoms/image";
import contactImage from "@assets/images/admissions/admissions-advising.png";

function AdmissionsContactIntro() {
  return (
    <div>
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
      <div className="relative mt-9 pb-5 pr-5">
        <div
          aria-hidden="true"
          className="absolute inset-x-1 top-5 bottom-0 bg-blue-dark"
        />
        <Image
          src={contactImage}
          alt="Imagen ilustrativa de una asesora académica conversando con una futura estudiante"
          className="aspect-4/3 w-full"
        />
      </div>
      <Paragraph
        size="small"
        variant="inherit"
        className="mt-6 max-w-sm leading-relaxed text-neutral-dark/75"
      >
        Tú eliges el siguiente paso. Nosotros te ayudamos a conocer tus
        opciones.
      </Paragraph>
    </div>
  );
}

export { AdmissionsContactIntro };
