import { useState, useEffect, useMemo } from "react";

const VARIANTS = {
  default: { base: 1.3, 640: 2.3, 768: 3, 1024: 4 },
  compact: { base: 2.2, 768: 3, 1024: 4 },
  grid: { base: 2, 768: 3, 1024: 4 },
};

const getCount = (config) => {
  if (typeof window === "undefined") return config.base;

  const width = window.innerWidth;

  const breakpoints = Object.keys(config)
    .filter((key) => key !== "base")
    .map(Number)
    .sort((a, b) => b - a); // de mayor a menor

  const match = breakpoints.find((bp) => width >= bp);

  return match !== undefined ? config[match] : config.base;
};

/**
 * @param {"default" | "compact" | "grid" | object} variant
 */

function useCardsPerView(variant = "default") {
  // Si pasas un objeto inline, evitamos recalcular en cada render
  const key = typeof variant === "string" ? variant : JSON.stringify(variant);

  const config = useMemo(
    () =>
      typeof variant === "string"
        ? (VARIANTS[variant] ?? VARIANTS.default)
        : variant,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const [cardsPerView, setCardsPerView] = useState(() => getCount(config));

  useEffect(() => {
    const onResize = () => setCardsPerView(getCount(config));

    onResize(); // por si cambió la variante
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [config]);

  return cardsPerView;
}

export { useCardsPerView };
