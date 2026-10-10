import { useEffect, useRef, useState } from "react";

const SEEN_KEY = "ipc-loader-seen";
const WAIT_CEILING = 69; // si el sitio aún no carga, el avatar espera sobre la C

// ¿Debe mostrarse el loader? Solo en la primera entrada de la sesión.
// sessionStorage sobrevive a la recarga (F5) y se borra al cerrar la pestaña.
export const shouldShowLoader = () => {
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
};

/**
 * Progreso 0 → 100 en `duration` ms, medido con rAF para que el salto sea fluido.
 * `onDone` se llama cuando empieza el desvanecido (o de inmediato si no hay loader).
 */
export function usePageLoader({
  duration = 2800,
  maxTime = 8000,
  exitDelay = 350,
  onDone,
} = {}) {
  const [show] = useState(shouldShowLoader);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(show);

  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (!show) {
      onDoneRef.current?.();
      return;
    }

    const start = performance.now();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let fontsReady = !document.fonts;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    let raf;
    let exitTimer;
    let shown = 0;

    const finish = () => {
      setProgress(100);
      exitTimer = setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        setVisible(false);
        onDoneRef.current?.();
      }, exitDelay);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* sin storage: no pasa nada */
      }
    };

    const frame = () => {
      const elapsed = performance.now() - start;
      const ready = document.readyState === "complete" && fontsReady;
      const timePct = Math.min(100, (elapsed / duration) * 100);

      shown = Math.max(shown, Math.min(timePct, ready ? 100 : WAIT_CEILING));
      setProgress(shown);

      if (shown >= 100 || elapsed >= maxTime) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [show, duration, maxTime, exitDelay]);

  return { progress, visible };
}
