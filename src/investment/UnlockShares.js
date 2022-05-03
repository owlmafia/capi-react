import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SharesDistributionChart } from "../charts/SharesDistributionChart";
import { LabeledInput } from "../common_comps/LabeledInput";
import { unlock } from "./controller";

export const UnlockShares = ({
  statusMsg,
  showProgress,
  myAddress,
  updateMyShares,
  updateMyBalance,
  updateInvestmentData,
  dao,
  investmentData,
}) => {
  let params = useParams();

  const [unlockSharesAmount, setUnlockSharesAmount] = useState(null);
  // TODO show error
  const [unlockSharesError, setUnlockSharesError] = useState(null);

  const view = () => {
    return (
      <div>
        <div>
          <div>{"Unlock shares"}</div>
          <div>{"Project shares"}</div>
          <div>{dao.share_supply}</div>
          <div>
            <div>{investmentData.investor_locked_shares}</div>
            <div>{"Your locked shares"}</div>
          </div>
          <div>
            <div>{investmentData.investor_unlocked_shares}</div>
            <div>{"Your unlocked shares"}</div>
          </div>
          <LabeledInput
            label={"Unlock shares"}
            placeholder={"Enter amount of shares"}
            inputValue={unlockSharesAmount}
            onChange={(input) => setUnlockSharesAmount(input)}
            errorMsg={unlockSharesError}
          />
        </div>
        <button
          className="button-primary"
          onClick={async () => {
            await unlock(
              myAddress,
              showProgress,
              statusMsg,
              updateMyBalance,
              updateMyShares,
              params.id,
              dao,
              updateInvestmentData
            );
          }}
        >
          {"Unlock shares"}
        </button>
        <SharesDistributionChart
          sharesDistr={[
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
