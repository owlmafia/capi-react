import { SubmitButton } from "../app_comps/SubmitButton";
import Modal from "./Modal";

export const OkCancelModal = ({
  title,
  closeModal,
  children,
  onSubmit,
  okLabel,
  cancelLabel,
}) => {
  return (
    <Modal title={title} onCloseClick={() => closeModal()}>
      <div>
        {children}
        <div>
          <SubmitButton
            label={okLabel ?? "Continue"}
            className="button-primary full-width-btn"
            onClick={async () => onSubmit()}
          />
          <SubmitButton
            label={cancelLabel ?? "Cancel"}
            className="button-primary full-width-btn"
            onClick={async () => closeModal()}
          />
        </div>
      </div>
    </Modal>
  );
};
