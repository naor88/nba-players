import { PropsWithChildren } from "react";

interface ModalProps extends PropsWithChildren{
  modalId: string;
  modalBoxClassName?: string;
}

export const Modal = ({ children, modalId, modalBoxClassName }: ModalProps) => {
  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className={`modal-box ${modalBoxClassName}`}>{children}</div>
        <label className="modal-backdrop" htmlFor={modalId}></label>
      </div>
    </>
  );
};
