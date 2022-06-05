import React, { useState } from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";
import arrow from "../images/svg/arrow-right.svg";
import { retrieveProfits } from "../shared_functions";
import { CopyPasteHtml } from "../common_comps/CopyPastText";
import Progress from "../app_comps/Progress";
import { SubmitButton } from "./SubmitButton";
import { SelectWallet } from "../wallet/SelectWallet";
import Modal from "../Modal";

export const MyAccount = ({ deps, daoId }) => {
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);

  return (
    <div className="my-account-container">
      <div className="d-flex justify-between">
        <div className="text">My Algo wallet</div>
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
            />
          </div>
          <div id="my_account_my_balance__balance">
            <FundsAssetImg />
            <div>{deps.myBalance.balance_funds_asset}</div>
            <img
              className="arrow"
              src={arrow}
              alt="arrow"
              onClick={async () => await disconnect()}
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
      <div>
        <div className="mb-5 ft-weight-600">
          {"Claimable dividend: " + deps.myDividend}
        </div>
        <div className="btn-block">
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
  } else {
    return <Progress />;
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
        {"Connect My Algo wallet"}
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
