import React, { useState } from "react";
import { useParams } from "react-router-dom";
import funds from "../images/funds.svg";
import { handleSharesCountInput, invest } from "./controller";
import ReactTooltip from "react-tooltip";
import { SubmitButton } from "../app_comps/SubmitButton";

export const InvestEmbedded = ({ deps, dao }) => {
  let params = useParams();
  const [buySharesCount, setBuySharesCount] = useState("1");
  const [totalCost, setTotalCost] = useState(
    deps.investmentData.init_share_price
  );
  const [totalPercentage, setProfitPercentage] = useState(
    deps.investmentData.init_profit_percentage
  );
  const [submitting, setSubmitting] = useState(false);

  const [shareAmountError, setShareAmountError] = useState("");

  return (
    <div className="dao_action_active_tab box-container">
      <div className="title">{"Buy Shares in project"}</div>
      <div className="dao-shares">
        <div className="top-block">
          <div className="available-shares">
            <div className="d-flex gap-10 ft-weight-600">
              <div className="subTitle mb-4">{"Available shares: "}</div>
              <div className="ft-weight-600">
                {deps.investmentData.available_shares}
              </div>
            </div>
            <div className="shares-block">
              <div className="ft-weight-600">You have:</div>
              <div className="shares-item">
                <div>{"Locked shares"}</div>
                <div className="ft-weight-600">
                  {deps.investmentData.investor_locked_shares}
                </div>
              </div>
              <div className="blue-circle"></div>
              <div className="shares-item">
                <div>{"Unlocked shares"}</div>
                <div className="ft-weight-600">
                  {deps.investmentData.investor_unlocked_shares}
                </div>
              </div>
            </div>
          </div>
          <div id="shares_const_container">
            <div className="ft-weight-600">{"Shares cost"}</div>
            <div className="d-flex">
              <img src={funds} alt="funds" />
              <div className="one_line_key_val_val ft-weight-600">
                {totalCost}
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex gap-10 align-center">
          <div>{"Dividend"}</div>
          <div data-tip="Your share of the project's income, after locking your shares">
            <div className="blue-circle"></div>
          </div>
          <ReactTooltip />
          <div>{totalPercentage}</div>
        </div>
      </div>
      <div className="labeled_input__error">{shareAmountError}</div>
      <input
        className="label-input-style mt-1"
        placeholder={"Enter amount of shares"}
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
      <SubmitButton
        label={"Buy shares"}
        className={"button-primary"}
        isLoading={submitting}
        disabled={deps.myAddress === ""}
        onClick={async (_) => {
          await invest(
            deps.myAddress,
            setSubmitting,
            deps.statusMsg,
            deps.updateMyBalance,
            params.id,
            dao,
            buySharesCount,
            deps.updateMyShares,
            deps.updateFunds,
            setShareAmountError,
            deps.wallet
          );
        }}
      />
    </div>
  );
};
