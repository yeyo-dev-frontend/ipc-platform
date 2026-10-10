import { AdmissionsProcessIntro } from "@/components/molecules/admissions/admissionsProcessIntro";
import { AdmissionsStudyMode } from "@/components/molecules/admissions/admissionsStudyMode";
import { AdmissionsPreparation } from "@/components/molecules/admissions/admissionsPreparation";
import { BannerBgCurve } from "@/components/molecules/shared/curvePath";
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
          <AdmissionsProcessIntro image={admissionProcessImages.students} />

          <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <AdmissionsPreparation
              requirements={admissionRequirements}
              image={admissionProcessImages.preparation}
            />
            <AdmissionsProcessSteps items={admissionSteps} />
          </div>

          <AdmissionsStudyMode study={admissionStudy} />
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
