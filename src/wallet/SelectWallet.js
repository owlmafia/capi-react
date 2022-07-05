import { SubmitButton } from "../app_comps/SubmitButton";
import { createMyAlgoWallet } from "./myAlgoWallet";
import { createWcWallet } from "./walletConnectWallet";

export const SelectWallet = ({ deps, onConnected }) => {
  return (
    <div>
      <SubmitButton
        label={"Wallet Connect"}
        className="button-primary full-width-btn mb-4"
        onClick={async () =>
          selectWallet(
            deps,
            createWcWallet(
              deps.statusMsg,
              deps.setMyAddress,
              deps.setWcShowOpenWalletModal
            ),
            onConnected
          )
        }
      />
      <SubmitButton
        label={"My Algo"}
        className="button-primary full-width-btn"
        onClick={async () =>
          selectWallet(
            deps,
            createMyAlgoWallet(deps.statusMsg, deps.setMyAddress),
            onConnected
          )
        }
      />
    </div>
  );
};

const selectWallet = async (deps, wallet, onConnected) => {
  await wallet.connect();
  deps.setWallet(wallet);

  onConnected();
};
