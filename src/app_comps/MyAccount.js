import React, { useState } from "react";
import arrow from "../images/svg/arrow-right.svg";
import { retrieveProfits } from "../shared_functions";
import { CopyPasteHtml } from "../common_comps/CopyPastText";
import Progress from "../app_comps/Progress";
import { SubmitButton } from "./SubmitButton";
import { SelectWallet } from "../wallet/SelectWallet";
import Modal from "../modal/Modal";
import funds from "../images/funds.svg";
import {
  needsToAcceptDisclaimer,
  saveAcceptedDisclaimer,
} from "../modal/storage";
import { DisclaimerModal } from "../modal/DisclaimerModal";

export const MyAccount = ({ deps, daoId }) => {
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  return (
    <div className="my-account-container">
      <div className="d-flex justify-between">
        <div className="text">Wallet</div>
      </div>
      <div className="my-address">
        {myAddressView(deps, daoId)}
        {connectButton(deps, setShowSelectWalletModal, setShowDisclaimerModal)}
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
      {showDisclaimerModal && (
        <DisclaimerModal
          closeModal={() => setShowDisclaimerModal(false)}
          onAccept={() => {
            saveAcceptedDisclaimer();
            setShowDisclaimerModal(false);
            // continue to select wallet: assumes that the disclaimer here is (only) shown when clicking on connect wallet
            setShowSelectWalletModal(true);
          }}
        />
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
                  className="ft-color-black"
                >
                  {deps.myAddressDisplay}
                </a>
              }
              copyText={deps.myAddress}
              statusMsg={deps.statusMsg}
              copyMsg={"Address copied to clipboard"}
            />
          </div>
          <div id="my_account_my_balance__balance">
            <img className="mr-2 s-16" src={funds} alt="funds" />
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
        <div className="mb-32 desc d-flex align-center justify-between">
          {"Claimable dividend: "}
          <div className="w-100px d-flex align-center gap-10">
            <img className="s-16" src={funds} alt="funds" />
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
                deps.updateMyDividend,
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

const connectButton = (
  deps,
  setShowSelectWalletModal,
  setShowDisclaimerModal
) => {
  if (deps.myAddress === "") {
    return (
      <button
        className="button-primary full-width-btn"
        onClick={async (event) => {
          if (await needsToAcceptDisclaimer()) {
            setShowDisclaimerModal(true);
          } else {
            setShowSelectWalletModal(true);
          }
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
