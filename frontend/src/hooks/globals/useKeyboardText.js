import { useEffect, useRef, useState } from "react";

function useTypewriter(text, options = {}) {
  const {
    typingSpeed = 55,
    deletingSpeed = 30,
    pauseAfterTyping = 4000,
    pauseAfterDeleting = 1000,
    randomTyping = true,
  } = options;

  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const deletingRef = useRef(false);

  useEffect(() => {
    let timeout;

    const tick = () => {
      const index = indexRef.current;
      const deleting = deletingRef.current;

      if (!deleting) {
        setDisplayed(text.slice(0, index + 1));
        indexRef.current++;

        if (indexRef.current === text.length) {
          timeout = setTimeout(() => {
            deletingRef.current = true;
            tick();
          }, pauseAfterTyping);

          return;
        }
      } else {
        setDisplayed(text.slice(0, index - 1));
        indexRef.current--;

        if (indexRef.current === 0) {
          deletingRef.current = false;
          timeout = setTimeout(tick, pauseAfterDeleting);

          return;
        }
      }

      const delay = deleting
        ? deletingSpeed
        : randomTyping
          ? Math.random() * 40 + typingSpeed
          : typingSpeed;

      timeout = setTimeout(tick, delay);
    };

    tick();

    return () => clearTimeout(timeout);
  }, [
    text,
    typingSpeed,
    deletingSpeed,
    pauseAfterTyping,
    pauseAfterDeleting,
    randomTyping,
  ]);

  return displayed;
}

export { useTypewriter };
