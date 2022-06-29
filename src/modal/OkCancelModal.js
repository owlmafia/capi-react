import { SubmitButton } from "../app_comps/SubmitButton";
import Modal from "./Modal";

export const OkCancelModal = ({ title, closeModal, children, onSubmit }) => {
  return (
    <Modal title={title} onCloseClick={() => closeModal()}>
      <div>
        {children}
        <div>
          <SubmitButton
            label={"Continue"}
            className="button-primary full-width-btn"
            onClick={async () => onSubmit()}
          />
          <SubmitButton
            label={"Cancel"}
            className="button-primary full-width-btn"
            onClick={async () => closeModal()}
          />
        </div>
      </div>
    </Modal>
  );
};
