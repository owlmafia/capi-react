import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { handleSharesCountInput, init, invest } from "./controller";

export const InvestEmbedded = ({
  showProgress,
  statusMsg,
  updateMyBalance,
  myAddress,
  dao,
  investmentData,
  updateMyShares,
  myShares,
  updateFunds,
}) => {
  let params = useParams();
  const [buySharesCount, setBuySharesCount] = useState("1");
  const [totalCost, setTotalCost] = useState(investmentData.init_share_price);
  const [totalPercentage, setProfitPercentage] = useState(
    investmentData.init_profit_percentage
  );

  useEffect(() => {
    init(statusMsg);
  }, [statusMsg]);

  return (
    <div className="dao_action_active_tab box-container">
      <div className="title">{"Buy shares"}</div>
      <div className="flex-block">
        <div className="subTitle">{"Available shares: "}</div>
        <div>{investmentData.available_shares}</div>
      </div>
      <div className="chartBlock">
        <div>{investmentData.investor_locked_shares}</div>
        <div className="circle"></div>
        <div>{"Your locked shares"}</div>
      </div>
      <div className="chartBlock">
        <div>{investmentData.investor_unlocked_shares}</div>
        <div className="circle"></div>
        <div>{"Your unlocked shares"}</div>
      </div>
      <div id="shares_const_container" className="secondary_info">
        <div>{"Cost:"}</div>
        <div className="one_line_key_val_val">{totalCost}</div>
        <FundsAssetImg />
      </div>
      <div className="chartBlock">
        <div>{"Dividend"}</div>
        <div>{totalPercentage}</div>
      </div>
      <input
        className="label-input-style"
        placeholder={""}
        size="30"
        value={buySharesCount}
        onChange={(event) => {
          handleSharesCountInput(
            statusMsg,
            event.target.value,
            dao,
            investmentData,
            setBuySharesCount,
            setTotalCost,
            setProfitPercentage
          );
        }}
      />
      <button
        disabled={myAddress === ""}
        className="button-primary"
        onClick={async (_) => {
          await invest(
            myAddress,
            showProgress,
            statusMsg,
            updateMyBalance,
            params.id,
            dao,
            buySharesCount,
            updateMyShares,
            updateFunds
          );
        }}
      >
        {"Buy"}
      </button>
    </div>
  );
};
