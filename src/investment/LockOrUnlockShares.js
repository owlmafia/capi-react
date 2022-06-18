import React, { useState } from "react";
import { SubmitButton } from "../app_comps/SubmitButton";
import { SharesDistributionChart } from "../charts/SharesDistributionChart";
import { LabeledInput } from "../common_comps/LabeledInput";
import { pieChartColors } from "../common_functions/common";
// import arrow from "../images/svg/arrow.svg";

export const LockOrUnlockShares = ({
  dao,
  investmentData,
  showInput,
  title,
  inputLabel,
  buttonLabel,
  submitting,
  // parameter: input (can be null if there's no input element or input text)
  onSubmit,
}) => {
  const [input, setInput] = useState(null);
  const [inputError, setInputError] = useState(null);

  const view = () => {
    return (
      <div className="box-container d-flex">
        <div className="w-60">
          <div className="title">{title}</div>
          <div className="chartBlock">
            <div className="subTitle ft-weight-600">
              {"Available Shares in project"}
            </div>
            <div className="subTitle">{dao.share_supply}</div>
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
          <SubmitButton
            label={buttonLabel}
            className="button-primary"
            isLoading={submitting}
            onClick={async () => {
              onSubmit(input, setInputError);
            }}
          />
        </div>
        <SharesDistributionChart
          sharesDistr={[
            to_pie_chart_slice(investmentData.investor_locked_shares),
            to_pie_chart_slice(investmentData.investor_unlocked_shares),
          ]}
          col={pieChartColors()}
          animated={false}
          disableClick={true}
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
