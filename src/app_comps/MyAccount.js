import React from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";
import arrow from "../images/svg/arrow-right.svg";
import { connectWalletAndUpdate, retrieveProfits } from "../shared_functions";
import { CopyPasteHtml } from "../common_comps/CopyPastText";
import Progress from "../app_comps/Progress";
import close from "../images/svg/close.svg";

export const MyAccount = ({
  deps,
  // optional: if set, shows "my shares"
  daoId,
}) => {
  return (
    <div className="my-account-container">
      <div className="d-flex justify-between">
        <div className="text">My Algo wallet</div>
        <img className="close-icon" width="14" height="14" src={close} alt="close" />
      </div>
      <div className="my-address">
        {myAddressView(deps, daoId)}
        {connectButton(deps)}
      </div>
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
              onClick={() => deps.setMyAddress("")}
            />
          </div>
        </div>
        {dividendSection(deps, daoId)}
      </div>
    );
  } else {
    return null;
  }
};

const dividendSection = (deps, daoId) => {
  if (deps.myDividend) {
    return (
      <div>
        <div className="mb-5 ft-weight-600">{"Claimable dividend: " + deps.myDividend}</div>
        <button
          className="button-primary full-width-btn"
          onClick={async () => {
            await retrieveProfits(
              deps.myAddress,
              deps.showProgress,
              deps.statusMsg,
              deps.updateMyBalance,
              daoId,
              deps.updateInvestmentData,
              deps.updateFunds
            );
          }}
        >
          {"Claim"}
        </button>
      </div>
    );
  } else {
    return <Progress />;
  }
};

const connectButton = (deps) => {
  if (deps.myAddress === "") {
    return (
      <button
        className="button-primary full-width-btn"
        onClick={async (event) => {
          await connectWalletAndUpdate(
            deps.statusMsg,
            deps.setMyAddress,
            deps.setMyAddressDisplay,
            deps.updateMyBalance
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
