import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LabeledInput } from "../common_comps/LabeledInput";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { StakeEmbedded } from "../stakeEmbedded/StakeEmbedded";
import { handleSharesCountInput, init, invest } from "./controller";

export const InvestEmbedded = ({
  showProgress,
  statusMsg,
  setMyBalance,
  myAddress,
  project,
  updateMyShares,
  myShares,
}) => {
  let params = useParams();
  const [buySharesCount, setBuySharesCount] = useState("10");
  const [totalCost, setTotalCost] = useState("");

  useEffect(() => {
    init(statusMsg, buySharesCount, project, setTotalCost);
  }, [statusMsg, buySharesCount, project]);

  return (
    <div className="project_action_active_tab">
      <LabeledInput
        label={"Buy:"}
        inputValue={buySharesCount}
        onChange={(input) =>
          handleSharesCountInput(
            input,
            project,
            setBuySharesCount,
            setTotalCost
          )
        }
        placeholder={""}
      />
      <div id="shares_const_container" className="secondary_info">
        <div>{"Cost:"}</div>
        <div className="one_line_key_val_val">{totalCost}</div>
        <FundsAssetImg />
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
            buySharesCount,
            updateMyShares
          );
        }}
      >
        {"Buy"}
      </button>
      <StakeEmbedded
        showProgress={showProgress}
        statusMsg={statusMsg}
        setMyBalance={setMyBalance}
        myAddress={myAddress}
        project={project}
        updateMyShares={updateMyShares}
        myShares={myShares}
      />
    </div>
  );
};
