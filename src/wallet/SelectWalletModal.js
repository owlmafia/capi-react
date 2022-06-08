import Modal from "../Modal";
import { SelectWallet } from "./SelectWallet";

export const SelectWalletModal = ({ deps, setShowModal }) => {
  return (
    <Modal title={"Choose a wallet"} onCloseClick={() => setShowModal(false)}>
      <SelectWallet deps={deps} onConnected={async () => setShowModal(false)} />
    </Modal>
  );
};
