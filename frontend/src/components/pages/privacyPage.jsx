import { Link } from "react-router-dom";
import { MyTemplate } from "../templates/myTemplate";
import { Title } from "../atoms/titles";
import { Paragraph } from "../atoms/paragraph";
import { privacyDraft } from "../../data/privacy";

function PrivacyPage() {
  return (
    <MyTemplate>
      <article className="mx-auto max-w-3xl px-6 py-12 font-poppins text-blue-dark sm:py-16">
        <Link
          to="/"
          className="text-sm underline underline-offset-4 focus-visible:outline-2"
        >
          Volver a Inicio
        </Link>
        <Title
          level="h1"
          size="hero"
          variant="institutional"
          weight="bold"
          className="mt-6 font-hani"
        >
          Política de privacidad
        </Title>
        <div className="my-8 border-l-4 border-blue bg-blue-dark/5 p-5">
          <Paragraph size="base" variant="inherit" weight="bold">
            Borrador para revisión institucional
          </Paragraph>
          <Paragraph
            size="small"
            variant="inherit"
            className="mt-2 leading-relaxed"
          >
            Esta propuesta aún no es una política definitiva. El correo de
            privacidad está pendiente de habilitación y confirmación. No
            utilices esta versión como autorización para recoger datos.
          </Paragraph>
        </div>
        <div className="space-y-8">
          {privacyDraft.map(({ id, title, text }) => (
            <section key={id} aria-labelledby={`privacy-${id}`}>
              <Title
                id={`privacy-${id}`}
                level="h2"
                size="compact"
                variant="institutional"
                weight="bold"
                className="font-hani"
              >
                {title}
              </Title>
              <Paragraph
                size="small"
                variant="inherit"
                className="mt-3 leading-relaxed"
              >
                {text}
              </Paragraph>
            </section>
          ))}
        </div>
      </article>
    </MyTemplate>
  );
}

export { PrivacyPage };
