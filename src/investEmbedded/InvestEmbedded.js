import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { handleSharesCountInput, init, invest } from "./controller";

export const InvestEmbedded = ({ deps, dao }) => {
  let params = useParams();
  const [buySharesCount, setBuySharesCount] = useState("1");
  const [totalCost, setTotalCost] = useState(
    deps.investmentData.init_share_price
  );
  const [totalPercentage, setProfitPercentage] = useState(
    deps.investmentData.init_profit_percentage
  );

  useEffect(() => {
    init(deps.statusMsg);
  }, [deps.statusMsg]);

  return (
    <div className="dao_action_active_tab box-container">
      <div className="title">{"Buy shares"}</div>
      <div className="flex-block">
        <div className="subTitle">{"Available shares: "}</div>
        <div>{deps.investmentData.available_shares}</div>
      </div>
      <div className="chartBlock">
        <div>{deps.investmentData.investor_locked_shares}</div>
        <div className="circle"></div>
        <div>{"Your locked shares"}</div>
      </div>
      <div className="chartBlock">
        <div>{deps.investmentData.investor_unlocked_shares}</div>
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
            deps.statusMsg,
            event.target.value,
            dao,
            deps.investmentData,
            setBuySharesCount,
            setTotalCost,
            setProfitPercentage
          );
        }}
      />
      <button
        disabled={deps.myAddress === ""}
        className="button-primary"
        onClick={async (_) => {
          await invest(
            deps.myAddress,
            deps.showProgress,
            deps.statusMsg,
            deps.updateMyBalance,
            params.id,
            dao,
            buySharesCount,
            deps.updateMyShares,
            deps.updateFunds
          );
        }}
      >
        {"Buy"}
      </button>
    </div>
  );
};
