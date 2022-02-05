import { useState } from "react";
import { useParams } from "react-router-dom";
import { LabeledInput } from "../common_comps/LabeledInput";
import { stake } from "./controller";

export const StakeEmbedded = ({
  showProgress,
  statusMsg,
  setMyBalance,
  myAddress,
  project,
  updateMyShares,
  myShares,
}) => {
  let params = useParams();
  const [stakeSharesCount, setStakeSharesCount] = useState("");

  if (project && myShares && myShares.free > 0) {
    return (
      <div className="project_action__stake_container">
        <p className="project_action__stake_info">
          {"You've " + myShares.free + " free shares"}
        </p>
        <LabeledInput
          className=""
          label={"Stake:"}
          inputValue={stakeSharesCount}
          onChange={(input) => setStakeSharesCount(input)}
          placeholder={""}
        />
        <button
          disabled={myAddress === ""}
          className="button__submit"
          onClick={async (_) => {
            await stake(
              myAddress,
              showProgress,
              statusMsg,
              setMyBalance,
              params.id,
              project,
              stakeSharesCount,
              updateMyShares
            );
          }}
        >
          {"Stake"}
        </button>
      </div>
    );
  } else {
    return null;
  }
};
