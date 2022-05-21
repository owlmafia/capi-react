import React, { useState } from "react";
import { SharesDistributionChart } from "../charts/SharesDistributionChart";
import { LabeledInput } from "../common_comps/LabeledInput";
import arrow from "../images/svg/arrow.svg";

export const LockOrUnlockShares = ({
  dao,
  investmentData,
  showInput,
  title,
  inputLabel,
  buttonLabel,
  // parameter: input (can be null if there's no input element or input text)
  onSubmit,
}) => {
  const [input, setInput] = useState(null);
  // TODO show error
  const [inputError, setInputError] = useState(null);

  const view = () => {
    return (
      <div className="box-container d-flex">
        <div className="w-60">
          <div className="title">{title}</div>
          <div className="flex-block">
            <div className="subTitle mb-4">{"Available Shares in project"}</div>
            <div className="subTitle">{dao.share_supply}</div>
            <img className="arrow" src={arrow} alt="arrow" />
          </div>
          <div className="chartBlock">
            <div>{investmentData.investor_locked_shares}</div>
            <div>{"Your locked shares"}</div>
          </div>
          <div className="chartBlock">
            <div>{investmentData.investor_unlocked_shares}</div>
            <div>{"Your unlocked shares"}</div>
          </div>
          {showInput && (
            <LabeledInput
              label={inputLabel}
              placeholder={"Enter amount of shares"}
              inputValue={input}
              onChange={(input) => setInput(input)}
              errorMsg={inputError}
            />
          )}
          <button
            className="button-primary"
            onClick={async () => {
              onSubmit(input);
            }}
          >
            {buttonLabel}
          </button>
        </div>
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
