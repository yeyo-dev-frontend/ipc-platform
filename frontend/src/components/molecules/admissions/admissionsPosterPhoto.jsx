import { Image } from "@/components/atoms/image";
import { BannerBgCurve } from "@/components/molecules/shared/curvePath";

function AdmissionsPosterPhoto({ src, alt }) {
  return (
    <div className="relative aspect-512/320 overflow-hidden bg-blue-dark">
      <Image
        src={src}
        alt={alt}
        fill
        className="absolute max-w-none w-[227.34375%] h-[188.4375%] left-[-121.09375%] top-[-14.0625%] object-fill"
      />
      <BannerBgCurve
        design={9}
        secondaryAccentColor="var(--color-blue-deep)"
        accentColor="var(--color-orange)"
        color="var(--color-neutral-white)"
        height="h-full"
        className="h-full"
      />
    </div>
  );
}

export { AdmissionsPosterPhoto };
