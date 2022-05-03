import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SharesDistributionChart } from "../charts/SharesDistributionChart";
import { LabeledInput } from "../common_comps/LabeledInput";
import { ContentTitle } from "../ContentTitle";
import { invest } from "./controller";

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
      <div>
        <div>
          <div>{"Buy more shares"}</div>
          <div>{"Project shares"}</div>
          <div>{dao.share_supply}</div>
          <div>
            <div>{investmentData.available_shares}</div>
            <div>{"Not owned"}</div>
          </div>
          <div>
            <div>{investmentData.investor_locked_shares}</div>
            <div>{"Your locked shares"}</div>
          </div>
          <div>
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
        </div>
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
