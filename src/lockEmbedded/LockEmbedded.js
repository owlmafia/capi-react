import { useState } from "react";
import { useParams } from "react-router-dom";
import { LabeledInput } from "../common_comps/LabeledInput";
import { lock } from "./controller";

export const LockEmbedded = ({
  showProgress,
  statusMsg,
  updateMyBalance,
  myAddress,
  project,
  updateMyShares,
  myShares,
}) => {
  let params = useParams();
  const [lockSharesCount, setLockSharesCount] = useState("");

  if (project && myShares && myShares.free > 0) {
    return (
      <div className="project_action__lock_container">
        <p className="project_action__lock_info">
          {"You've " + myShares.free + " free shares"}
        </p>
        <LabeledInput
          className=""
          label={"Lock:"}
          inputValue={lockSharesCount}
          onChange={(input) => setLockSharesCount(input)}
          placeholder={""}
        />
        <button
          disabled={myAddress === ""}
          className="button__submit"
          onClick={async (_) => {
            await lock(
              myAddress,
              showProgress,
              statusMsg,
              updateMyBalance,
              params.id,
              project,
              lockSharesCount,
              updateMyShares
            );
          }}
        >
          {"Lock"}
        </button>
      </div>
    );
  } else {
    return null;
  }
};
