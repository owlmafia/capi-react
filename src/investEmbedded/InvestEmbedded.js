import React, { useState, useEffect } from "react";
import { init, invest, handleSharesCountInput } from "./controller";
import { useParams } from "react-router-dom";
import { AmountInput } from "../common_comps/AmountInput";

export const InvestEmbedded = ({
  showProgress,
  statusMsg,
  setMyBalance,
  myAddress,
  project,
}) => {
  let params = useParams();
  const [buySharesCount, setBuySharesCount] = useState("10");
  const [totalCost, setTotalCost] = useState("");

  useEffect(() => {
    init(statusMsg, buySharesCount, project, setTotalCost);
  }, [statusMsg, buySharesCount]);

  return (
    <div class="project_action_active_tab">
      <p class="input_label">{"Shares:"}</p>
      <AmountInput
        value={buySharesCount}
        onChange={(input) =>
          handleSharesCountInput(
            input,
            project,
            setBuySharesCount,
            setTotalCost
          )
        }
      />
      <div className="secondary_info">
        <span>{"Cost:"}</span>
        <span className="one_line_key_val_val">{totalCost}</span>
      </div>
      <button
        disabled={myAddress === ""}
        className="button__submit"
        onClick={async (_) => {
          await invest(
            myAddress,
            showProgress,
            statusMsg,
            setMyBalance,
            params.id,
            project,
            buySharesCount
          );
        }}
      >
        {"Buy"}
      </button>
    </div>
  );
};
