import React, { useEffect, useState } from "react";
import { LabeledCurrencyInput } from "../common_comps/LabeledInput";
import { init, pay } from "./controller";

export const PayEmbedded = ({
  showProgress,
  statusMsg,
  updateMyBalance,
  myAddress,
  dao,
  updateFunds,
}) => {
  const [amount, setAmount] = useState("10");

  useEffect(() => {
    init(statusMsg);
  }, [statusMsg]);

  return (
    <div className="dao_action_active_tab">
      <LabeledCurrencyInput
        label={"Amount"}
        inputValue={amount}
        onChange={(input) => setAmount(input)}
      />
      <button
        disabled={myAddress === ""}
        className="button-red"
        onClick={async (_) => {
          await pay(
            myAddress,
            showProgress,
            statusMsg,
            updateMyBalance,
            dao,
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
