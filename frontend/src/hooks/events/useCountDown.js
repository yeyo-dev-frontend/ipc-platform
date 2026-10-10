import { useEffect, useState } from "react";

function getTimeLeft(target, now) {
  const diff = Math.max(0, new Date(target).getTime() - now);
  const s = Math.floor(diff / 1000);

  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    finished: diff === 0,
  };
}

/** Cuenta regresiva hacia `target` (string ISO o Date). Cambia al instante si cambia el target. */
function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return getTimeLeft(target, now);
}

export { useCountdown };
