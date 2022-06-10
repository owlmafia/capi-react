import Modal from "../Modal";
import { BuyAlgosContent } from "./BuyAlgosContent";
import { BuyCurrencyInfoView } from "./BuyCurrencyInfoView";
import { startBuyCurrencyFlow } from "./controller";

export const BuyAlgosModal = ({ deps, closeModal }) => {
  return (
    <Modal title={"Top your account"} onCloseClick={() => closeModal()}>
      <BuyCurrencyInfoView
        deps={deps}
        closeModal={() => closeModal()}
        onSubmit={() => startBuyCurrencyFlow(deps, "ALGO", "1", closeModal)}
      >
        <BuyAlgosContent />
      </BuyCurrencyInfoView>
    </Modal>
  );
};
