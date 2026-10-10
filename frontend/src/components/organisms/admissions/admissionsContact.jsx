import { AdmissionsContactIntro } from "@/components/organisms/admissions/admissionsContactIntro";
import { AdmissionsContactForm } from "@/components/molecules/admissions/admissionsContactForm";

function AdmissionsContact() {
  return (
    <section
      aria-labelledby="admissions-contact-title"
      className="bg-neutral-white px-5 pt-12 pb-20 font-poppins sm:px-8 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <AdmissionsContactIntro />
        <AdmissionsContactForm />
      </div>
    </section>
  );
}

export { AdmissionsContact };
