import React, { useState, useEffect } from "react";
import { init, invest, handleSharesCountInput } from "./controller";
import { useParams } from "react-router-dom";

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
      <input
        placeholder=""
        size="30"
        id="invest_em_share_count_input"
        className="last_input"
        value={buySharesCount}
        onChange={(event) =>
          handleSharesCountInput(
            event.target.value,
            project,
            setBuySharesCount,
            setTotalCost
          )
        }
      />
      <div className="secondary_info last_before_submit_button">
        <span>{"Cost:"}</span>
        <span className="one_line_key_val_val">{totalCost}</span>
      </div>
      <button
        disabled={myAddress === ""}
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
