import { useState } from 'react';

function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(prevState => !prevState);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, toggleModal, openModal, closeModal };
}

export default useModal;
