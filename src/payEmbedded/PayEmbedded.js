import React, { useEffect, useState } from "react";
import { AmountInput } from "../common_comps/AmountInput";
import { init, pay } from "./controller";

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
    <div className="project_action_active_tab">
      <p className="input_label">{"Amount:"}</p>
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
