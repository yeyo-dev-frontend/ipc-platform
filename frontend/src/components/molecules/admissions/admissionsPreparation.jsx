import { Image } from "@/components/atoms/image";
import { AdmissionsRequirements } from "./admissionsRequirements";

function AdmissionsPreparation({ requirements, image }) {
  return (
    <div>
      <AdmissionsRequirements items={requirements} />
      <Image
        src={image.src}
        alt={image.alt}
        className="mt-7 aspect-16/8 w-full"
      />
    </div>
  );
}

export { AdmissionsPreparation };
