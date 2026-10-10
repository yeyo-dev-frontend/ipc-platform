import { Paragraph } from "@/components/atoms/paragraph";
import { Image } from "@/components/atoms/image";
import contactImage from "@assets/images/admissions/admissions-advising.png";

function AdmissionsContactVisual() {
  return (
    <>
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
    </>
  );
}

export { AdmissionsContactVisual };
