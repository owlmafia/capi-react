import React, { useState } from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";
import arrow from "../images/svg/arrow-right.svg";
import { retrieveProfits } from "../shared_functions";
import { CopyPasteHtml } from "../common_comps/CopyPastText";
import Progress from "../app_comps/Progress";
import { SubmitButton } from "./SubmitButton";
import { SelectWallet } from "../wallet/SelectWallet";
import Modal from "../Modal";
import funds from "../images/funds.svg";

export const MyAccount = ({ deps, daoId }) => {
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);

  return (
    <div className="my-account-container">
      <div className="d-flex justify-between">
        <div className="text">Wallet</div>
      </div>
      <div className="my-address">
        {myAddressView(deps, daoId)}
        {connectButton(deps, setShowSelectWalletModal)}
      </div>
      {showSelectWalletModal && (
        <Modal
          title={"Choose a wallet"}
          onCloseClick={() => setShowSelectWalletModal(false)}
        >
          <SelectWallet
            deps={deps}
            onConnected={() => setShowSelectWalletModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

const myAddressView = (deps, daoId) => {
  if (deps.myAddress !== "") {
    return (
      <div id="user_data">
        <div className="my_address">
          <div>
            <CopyPasteHtml
              element={
                <a
                  href={
                    "https://testnet.algoexplorer.io/address/" + deps.myAddress
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="ft-color-black ft-weight-600"
                >
                  {deps.myAddressDisplay}
                </a>
              }
              copyText={deps.myAddress}
              statusMsg={deps.statusMsg}
            />
          </div>
          <div id="my_account_my_balance__balance">
            <img className="mr-2" src={funds} alt="funds" />
            <div>{deps.myBalance.balance_funds_asset}</div>
            <img
              className="arrow"
              src={arrow}
              alt="arrow"
              onClick={async () => await disconnect(deps)}
            />
          </div>
        </div>
        <DividendSection deps={deps} daoId={daoId} />
      </div>
    );
  } else {
    return null;
  }
};

const DividendSection = ({ deps, daoId }) => {
  const [submitting, setSubmitting] = useState(false);

  if (deps.myDividend) {
    return (
      <div className="d-flex flex-column">
        <div className="mb-5 ft-weight-600 ft-size-18 d-flex align-center justify-between">
          {"Claimable dividend: "}
          <div className="w-100-p d-flex align-center gap-10">
            <img src={funds} alt="funds" />
            {deps.myDividend}
          </div>
        </div>
        <div className="btn-block w-100">
          <SubmitButton
            label={"Claim"}
            className="button-primary full-width-btn"
            isLoading={submitting}
            onClick={async () => {
              await retrieveProfits(
                deps.myAddress,
                setSubmitting,
                deps.statusMsg,
                deps.updateMyBalance,
                daoId,
                deps.updateInvestmentData,
                deps.updateFunds,
                deps.wallet
              );
            }}
          />
        </div>
      </div>
    );
  } else if (daoId) {
    // we're on a dao page: waiting for dividend to be fetched
    return <Progress />;
  } else {
    return null;
  }
};

const connectButton = (deps, setShowSelectWalletModal) => {
  if (deps.myAddress === "") {
    return (
      <button
        className="button-primary full-width-btn"
        onClick={async (event) => {
          setShowSelectWalletModal(true);
        }}
      >
        {"Connect wallet"}
      </button>
    );
  } else {
    return null;
  }
};

const disconnect = async (deps) => {
  try {
    await deps.wallet.disconnect();
    deps.setMyAddress("");
  } catch (e) {
    deps.statusMsg.error(e);
  }
};
