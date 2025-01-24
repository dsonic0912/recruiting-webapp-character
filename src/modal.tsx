import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({ open, children, onClose }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal") as HTMLElement,
  );
}

export default Modal;
