import React, { useState, useEffect } from "react";
import { init, pay } from "./controller";
import { AmountInput } from "../common_comps/AmountInput";

export const PayEmbedded = ({
  showProgress,
  statusMsg,
  setMyBalance,
  myAddress,
  project,
}) => {
  const [amount, setAmount] = useState("10");

  useEffect(() => {
    init(statusMsg);
  }, [statusMsg]);

  return (
    <div class="project_action_active_tab">
      <p class="input_label">{"Amount:"}</p>
      <AmountInput value={amount} onChange={(input) => setAmount(input)} />
      <button
        disabled={myAddress === ""}
        className="button__submit_after_input"
        onClick={async (_) => {
          await pay(
            myAddress,
            showProgress,
            statusMsg,
            setMyBalance,
            project,
            amount
          );
        }}
      >
        {"Pay"}
      </button>
    </div>
  );
};
