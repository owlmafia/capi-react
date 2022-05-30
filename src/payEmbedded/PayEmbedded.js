import React, { useEffect, useState } from "react";
import { LabeledCurrencyInput } from "../common_comps/LabeledInput";
import { init, pay } from "./controller";

export const PayEmbedded = ({
  statusMsg,
  updateMyBalance,
  myAddress,
  dao,
  updateFunds,
}) => {
  const [amount, setAmount] = useState("10");
  const [submitting, setSubmitting] = useState(false);

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
      <SubmitButton
        label={"Pay"}
        className="button-primary"
        isLoading={submitting}
        disabled={myAddress === ""}
        onClick={async () => {
          await pay(
            myAddress,
            setSubmitting,
            statusMsg,
            updateMyBalance,
            dao,
            amount,
            updateFunds
          );
        }}
      />
    </div>
  );
};
