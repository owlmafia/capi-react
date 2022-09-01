import Modal from "../modal/Modal";
import { DevSettings } from "./DevSettings";

export const DevSettingsModal = ({ deps, closeModal }) => {
  return (
    <Modal title={"Dev settings"} onCloseClick={() => closeModal()}>
      <DevSettings deps={deps} closeModal={closeModal} />
    </Modal>
  );
};
