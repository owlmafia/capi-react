import React from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";
import myalgo from "../images/svg/myalgo.svg";
import arrow from "../images/svg/arrow-right.svg";
import {
  connectWalletAndUpdate,
  retrieveProfits,
  shortedAddress,
} from "../shared_functions";
import { CopyPasteHtml } from "../common_comps/CopyPastText";

export const MyAccount = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,
  // optional: if set, shows "my shares"
  daoId,
  myDividend,
  showProgress,
  updateInvestmentData,
  updateFunds,
}) => {
  return (
    <div className="my-account-container">
      <div className="text">My Algo wallet</div>
      {myAddressView(
        statusMsgUpdater,
        myAddress,
        setMyAddress,
        myAddressDisplay,
        myBalance,
        myDividend,
        daoId,
        updateMyBalance,
        showProgress,
        updateInvestmentData,
        updateFunds
      )}
      {connectButton(
        myAddress,
        setMyAddress,
        setMyAddressDisplay,
        updateMyBalance,
        statusMsgUpdater
      )}
    </div>
  );
};

const myAddressView = (
  statusMsg,
  myAddress,
  setMyAddress,
  myAddressDisplay,
  myBalance,
  myDividend,
  daoId,
  updateMyBalance,
  showProgress,
  updateInvestmentData,
  updateFunds
) => {
  if (myAddress !== "") {
    return (
      <div id="user_data">
        <div className="my_address">
          <div>
            <CopyPasteHtml
              element={
                <a
                  href={"https://testnet.algoexplorer.io/address/" + myAddress}
                  target="_blank"
                  rel="noreferrer"
                >
                  {myAddressDisplay}
                </a>
              }
              copyText={myAddress}
            />
          </div>
          <div id="my_account_my_balance__balance">
            <FundsAssetImg />
            <div>{myBalance.balance_funds_asset}</div>
            <img
              className="arrow"
              src={arrow}
              alt="arrow"
              onClick={() => setMyAddress("")}
            />
          </div>
        </div>
        {myDividend &&
          dividendSection(
            showProgress,
            myAddress,
            statusMsg,
            updateMyBalance,
            daoId,
            myDividend,
            updateInvestmentData,
            updateFunds
          )}
      </div>
    );
  } else {
    return null;
  }
};

const dividendSection = (
  showProgress,
  myAddress,
  statusMsg,
  updateMyBalance,
  daoId,
  dividend,
  updateInvestmentData,
  updateFunds
) => {
  return (
    <div>
      <div>{"Claimable dividend: " + dividend}</div>
      <button
        className="button-primary full-width-btn"
        onClick={async () => {
          await retrieveProfits(
            myAddress,
            showProgress,
            statusMsg,
            updateMyBalance,
            daoId,
            updateInvestmentData,
            updateFunds
          );
        }}
      >
        {"Claim"}
      </button>
    </div>
  );
};

const connectButton = (
  myAddress,
  setMyAddress,
  setMyAddressDisplay,
  updateMyBalance,
  statusMsg
) => {
  if (myAddress === "") {
    return (
      <button
        className="button-primary full-width-btn"
        onClick={async (event) => {
          await connectWalletAndUpdate(
            statusMsg,
            setMyAddress,
            setMyAddressDisplay,
            updateMyBalance
          );
        }}
      >
        {"Connect My Algo wallet"}
      </button>
    );
  } else {
    return null;
  }
};
