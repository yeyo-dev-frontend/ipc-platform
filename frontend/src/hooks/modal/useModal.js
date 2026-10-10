import { useState } from "react";

export const useModal = (initialValue = false) => {
  const [isOpen, setIsOpen] = useState(initialValue);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const toggleModal = () => {
    isOpen ? closeModal() : openModal();
  };

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
