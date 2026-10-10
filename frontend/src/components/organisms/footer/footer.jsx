import { GiSlicingArrow } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FooterBrand } from "../../molecules/footer/footerBrand";
import { FooterCareers } from "../../molecules/footer/footerCareers";
import { FooterSchedule } from "../../molecules/footer/footerSchedule";
import { FooterSocial } from "../../molecules/footer/footerSocial";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative isolate overflow-hidden bg-blue-deep text-white">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver al inicio"
        className="
          absolute top-4 right-4 z-10
          flex items-center justify-center size-12 md:size-15
          rounded-full border border-white/30
          text-white/80
          transition-all duration-200
          hover:bg-white hover:text-blue-deep hover:border-white hover:-translate-y-0.5
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
        "
      >
        <GiSlicingArrow className="size-6 md:size-9 -rotate-139 animate-float" />
      </button>

      <div className="relative grid gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-[3%] lg:py-16">
        <div className="sm:col-span-2 lg:col-span-1">
        <FooterBrand />
        </div>
        <FooterCareers />
        <FooterSchedule />
        <FooterSocial />
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t border-neutral-white/20 px-20 py-3 text-center font-poppins sm:px-24">
        <small className="text-xs leading-relaxed text-neutral-white/90">
          © 2026 Instituto Privado Celendín
        </small>
        <small className="text-xs leading-relaxed text-neutral-white/70">
          <Link to="/privacy" className="text-neutral-white/90 underline underline-offset-4 transition-colors hover:text-neutral-white focus-visible:outline-2 focus-visible:outline-offset-4">
            Política de privacidad (borrador)
          </Link>
        </small>
        <small className="text-xs leading-relaxed text-neutral-white/70">
          Desarrollado por <span className="text-neutral-white/90">Wynsley &amp; Yerson</span>
        </small>
      </div>
    </footer>
  );
}

export { Footer };
