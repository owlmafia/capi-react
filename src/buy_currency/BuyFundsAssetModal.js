import Modal from "../Modal";
import { BuyFundsAssetContent } from "./BuyFundsAssetContent";
import { BuyCurrencyInfoView } from "./BuyCurrencyInfoView";
import { startBuyCurrencyFlow } from "./controller";

export const BuyFundsAssetModal = ({ deps, amount, closeModal }) => {
  return (
    <Modal title={"Top your account"} onCloseClick={() => closeModal()}>
      <BuyCurrencyInfoView
        deps={deps}
        closeModal={() => closeModal()}
        onSubmit={() => startBuyCurrencyFlow(deps, "USDC", amount, closeModal)}
      >
        <BuyFundsAssetContent />
      </BuyCurrencyInfoView>
    </Modal>
  );
};
