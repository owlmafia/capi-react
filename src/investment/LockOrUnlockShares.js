import React, { useState } from "react";
import { SubmitButton } from "../app_comps/SubmitButton";
import { SharesDistributionChart } from "../charts/SharesDistributionChart";
import { LabeledAmountInput, LabeledInput } from "../common_comps/LabeledInput";
import { pieChartColors } from "../common_functions/common";
import redArrow from "../images/svg/arrow.svg";
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
            <div className="ft-size-18 ft-weight-600">{"Share supply"}</div>
            <div className="ft-size-24 ft-weight-700 color-black-000">
              {dao.share_supply}
            </div>
            <div>
              <img src={redArrow} alt="redArrow" />
            </div>
          </div>
          <div className="chartBlock ">
            <div className="numbers ft-size-18 ft-weight-600">
              {investmentData.investor_locked_shares}
            </div>
            <div className="h-16">
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8.5" r="8" fill="#6BB9BD" />
              </svg>
            </div>
            <div>{"Your locked shares"}</div>
          </div>
          <div className="chartBlock">
            <div className="numbers ft-size-18 ft-weight-600">
              {investmentData.investor_unlocked_shares}
            </div>
            <div className="h-16">
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8.5" r="8" fill="#8ECACD" />
              </svg>
            </div>
            <div>{"Your unlocked shares"}</div>
          </div>
          {showInput && (
            <LabeledAmountInput
              label={inputLabel}
              placeholder={"Enter amount"}
              inputValue={input}
              onChange={setInput}
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
