import { PropsWithChildren } from "react";

interface ModalProps extends PropsWithChildren{
  modalId: string;
}

export const Modal = ({ children, modalId }: ModalProps) => {
  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">{children}</div>
        <label className="modal-backdrop" htmlFor={modalId}></label>
      </div>
    </>
  );
};
