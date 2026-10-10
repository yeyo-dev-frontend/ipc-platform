import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function useScrollTop() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    // Carga inicial o recarga: dejamos que el navegador restaure su posición
    if (previousPath.current === pathname) return;

    previousPath.current = pathname;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
}

export { useScrollTop };
