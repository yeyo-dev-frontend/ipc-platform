import { useClickOutside } from "../../hooks/modal/usClickOutside";
import { ContactForm } from "../molecules/shared/contactForm";

function ModalMessage({ toggleModal }) {
  const modalRef = useClickOutside(toggleModal);

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="relative max-h-[90svh] w-full max-w-xl overflow-y-auto bg-blue-deep p-5"
      >
        <ContactForm showSteps onCancel={toggleModal} />
      </div>
    </div>
  );
}

export { ModalMessage };
