import { SubmitButton } from "../app_comps/SubmitButton";
import useScript from "../common_hooks/useScript";
import { startBuyCurrencyFlow } from "./controller";

export const BuyCurrencyInfoView = ({ deps, closeModal }) => {
  useScript("https://verify.sendwyre.com/js/verify-module-init-beta.js");

  return (
    <div>
      <div>
        <span>
          {"You don't have enough Algos to pay for the transaction fees ("}
        </span>
        <span className="ft-weight-bold">{"less than $0.01"}</span>
        <span>{" in total!)"}</span>
      </div>
      <div>
        {
          "Continue to be directed to a payment provider, where you can buy Algos with a credit card or Apple Pay."
        }
      </div>

      <div>
        <SubmitButton
          label={"Continue"}
          className="button-primary full-width-btn"
          onClick={async () =>
            startBuyCurrencyFlow(deps.statusMsg, closeModal, deps.myAddress)
          } // close this modal (wyre modal is not open)
        />
        <SubmitButton
          label={"Cancel"}
          className="button-primary full-width-btn"
          onClick={async () => closeModal()}
        />
      </div>
    </div>
  );
};
