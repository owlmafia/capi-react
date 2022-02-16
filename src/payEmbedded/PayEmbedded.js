import React, { useEffect, useState } from "react";
import { LabeledCurrencyInput } from "../common_comps/LabeledInput";
import { init, pay } from "./controller";

export const PayEmbedded = ({
  showProgress,
  statusMsg,
  updateMyBalance,
  myAddress,
  project,
  updateFunds,
}) => {
  const [amount, setAmount] = useState("10");

  useEffect(() => {
    init(statusMsg);
  }, [statusMsg]);

  return (
    <div className="project_action_active_tab">
      <LabeledCurrencyInput
        label={"Amount"}
        inputValue={amount}
        onChange={(input) => setAmount(input)}
      />
      <button
        disabled={myAddress === ""}
        className="button__submit_after_input"
        onClick={async (_) => {
          await pay(
            myAddress,
            showProgress,
            statusMsg,
            updateMyBalance,
            project,
            amount,
            updateFunds
          );
        }}
      >
        {"Pay"}
      </button>
    </div>
  );
};
