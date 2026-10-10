import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useModal } from "./useModal";

export function useHoverMenu({
  menuWidth = 288,
  edgeGap = 16,
  closeDelay = 150,
} = {}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const anchorRef = useRef(null);
  const menuRef = useRef(null);
  const timerRef = useRef(null);

  const cancelClose = () => clearTimeout(timerRef.current);

  const open = () => {
    cancelClose();
    openModal();
  };

  // Espera corta para poder pasar del botón al menú sin que se cierre.
  const scheduleClose = () => {
    cancelClose();
    timerRef.current = setTimeout(closeModal, closeDelay);
  };

  const measure = () => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;

    if (!anchor || !menu) {
      if (import.meta.env?.DEV) {
        console.warn(
          "[useHoverMenu] anchorRef o menuRef son null. Asegúrate de poner " +
            "anchorRef en un elemento DOM (div) y menuRef en el menú.",
        );
      }
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const parent = menu.offsetParent ?? document.body;
    const parentRect = parent.getBoundingClientRect();

    const maxLeft = parentRect.width - menuWidth - edgeGap;
    setPosition({
      top: anchorRect.bottom - parentRect.top,
      left: Math.max(
        edgeGap,
        Math.min(anchorRect.left - parentRect.left, maxLeft),
      ),
    });
  };

  // Mide antes de pintar (sin parpadeo) cada vez que se abre.
  useLayoutEffect(() => {
    if (isOpen) measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Limpia el timer al desmontar.
  useEffect(() => cancelClose, []);

  // Mientras está abierto: reposiciona al cambiar el tamaño, cierra con
  // clic/toque fuera (ancla + menú cuentan como "dentro") y con Esc.
  // useClickOutside solo admite un elemento, por eso aquí se revisan dos refs.
  useEffect(() => {
    if (!isOpen) return;

    const onMouseDown = (e) => {
      const inAnchor = anchorRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inAnchor && !inMenu) closeModal();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, closeModal]);

  return {
    isOpen,
    position,
    anchorRef,
    menuRef,
    open,
    close: closeModal,
    scheduleClose,
    cancelClose,
  };
}
