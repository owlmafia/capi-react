import { SubmitButton } from "../app_comps/SubmitButton";
import useScript from "../common_hooks/useScript";
import { startBuyCurrencyFlow } from "./controller";

export const BuyCurrencyInfoView = ({ closeModal, children, onSubmit }) => {
  useScript("https://verify.sendwyre.com/js/verify-module-init-beta.js");

  return (
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
  );
};
