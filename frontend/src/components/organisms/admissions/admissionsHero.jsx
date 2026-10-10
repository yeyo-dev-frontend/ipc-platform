import { Image } from "@/components/atoms/image";
import { AdmissionsHeroContent } from "@/components/molecules/admissions/admissionsHeroContent";
import { services } from "@/data/ServicesAcademic";

import { PriceSummaryCard } from "@/components/molecules/shared/priceSummaryCard";
import admissionsImage from "@assets/images/admissions/admissions-classroom.png";

function AdmissionsHero({ onRegister }) {
  return (
    <div className="bg-neutral-white pb-8 sm:pb-10">
      <section
        aria-labelledby="admissions-title"
        className="relative isolate flex min-h-142 items-center justify-center bg-blue-dark px-5 pt-10 pb-28 font-poppins sm:min-h-168 sm:px-8 lg:min-h-154"
      >
        <Image
          src={admissionsImage}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          imageClassName="object-[70%_center] md:object-center"
          overlayClassName="bg-linear-to-r from-black/75 via-black/60 to-black/25"
        />
        <AdmissionsHeroContent onRegister={onRegister} />
      </section>
      <PriceSummaryCard
        title="Inversión en tu formación"
        items={services}
        className="z-10 mx-auto -mt-12 w-[92%] max-w-5xl sm:-mt-16"
      />
    </div>
  );
}

export { AdmissionsHero };
