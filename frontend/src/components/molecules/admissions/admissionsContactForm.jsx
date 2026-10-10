import { Title } from "@/components/atoms/titles";
import { Paragraph } from "@/components/atoms/paragraph";
import { ContactForm } from "@/components/molecules/shared/contactForm";

function AdmissionsContactForm() {
  return (
    <div className="min-w-0 rounded-xl border border-blue-dark/10 bg-white p-5 sm:p-8">
      <Title
        level="h3"
        size="compact"
        variant="institutional"
        weight="bold"
        className="font-hani"
      >
        Queremos conocerte
      </Title>
      <Paragraph
        size="inherit"
        variant="inherit"
        className="mt-2 mb-7 leading-relaxed text-neutral-dark/35 italic"
      >
        Completa tus datos para solicitar información.
      </Paragraph>
      <ContactForm appearance="light" />
    </div>
  );
}

export { AdmissionsContactForm };
