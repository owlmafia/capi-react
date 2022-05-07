import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SharesDistributionChart } from "../charts/SharesDistributionChart";
import { LabeledInput } from "../common_comps/LabeledInput";
import { invest } from "./controller";
import arrow from "../images/svg/arrow.svg";

export const BuyMoreShares = ({
  statusMsg,
  showProgress,
  myAddress,
  updateMyShares,
  updateMyBalance,
  updateFunds,
  dao,
  investmentData,
}) => {
  let params = useParams();

  const [buySharesAmount, setBuySharesAmount] = useState(null);
  // TODO show error
  const [buySharesAmountError, setBuySharesAmountError] = useState(null);

  const view = () => {
    return (
      <div className="box-container">
        <div className="w-60">
          <div className="title">{"Buy more shares"}</div>
          <div className="flex-block">
            <div className="subTitle">{"Available Shares in project"}</div>
            <div className="subTitle">{dao.share_supply}</div>
            <img className="arrow" src={arrow} alt="arrow"/>
          </div>
          <div className="chartBlock">
            <div>{investmentData.available_shares}</div>
            <div>{"Not owned"}</div>
          </div>
          <div className="chartBlock">
            <div>{investmentData.investor_locked_shares}</div>
            <div>{"Your locked shares"}</div>
          </div>
          <div className="chartBlock">
            <div>{investmentData.investor_unlocked_shares}</div>
            <div>{"Your unlocked shares"}</div>
          </div>
          <LabeledInput
            label={"Buy shares"}
            placeholder={"Enter amount of shares"}
            inputValue={buySharesAmount}
            onChange={(input) => setBuySharesAmount(input)}
            errorMsg={buySharesAmountError}
          />
        <button
          className="button-primary"
          disabled={investmentData.available_shares === "0"}
          onClick={async () => {
            await invest(
              myAddress,
              showProgress,
              statusMsg,
              updateMyBalance,
              params.id,
              dao,
              buySharesAmount,
              updateMyShares,
              updateFunds
            );
          }}
        >
          {"Buy shares"}
        </button>
        <SharesDistributionChart
          sharesDistr={[
            to_pie_chart_slice(investmentData.available_shares),
            to_pie_chart_slice(investmentData.investor_locked_shares),
            to_pie_chart_slice(investmentData.investor_unlocked_shares),
          ]}
        />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>{dao && investmentData && view()}</div>
    </div>
  );
};

const to_pie_chart_slice = (percentage) => {
  return { percentage_number: percentage };
};
