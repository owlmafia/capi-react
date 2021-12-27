import React, { useState, useEffect } from "react";
import { init, withdraw, loadWithdrawals } from "./controller";
import { ProjectName } from "../ProjectName";

export const Withdrawal = (props) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [project, setProject] = useState(null);

  useEffect(() => {
    init(
      props.match.params.uuid,
      props.history.location.state,
      setProject,
      props.statusMsg
    );
  }, [props.history.location.state, props.match.params.uuid, props.statusMsg]);

  const view = () => {
    if (project) {
      return (
        <div>
          <ProjectName project={project} />
          <div>{"How much (Algo)?"}</div>
          <input
            placeholder=""
            className="full-width-input"
            size="64"
            value={withdrawalAmount}
            onChange={(event) => {
              setWithdrawalAmount(event.target.value);
            }}
          />
          <div>{"For what?"}</div>
          <input
            placeholder=""
            className="full-width-input"
            size="64"
            value={withdrawalDescr}
            onChange={(event) => {
              setWithdrawalDescr(event.target.value);
            }}
          />
          <button
            disabled={props.myAddress === ""}
            onClick={async () => {
              await withdraw(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.setMyBalance,
                props.match.params.uuid,
                withdrawalAmount,
                withdrawalDescr
              );
            }}
          >
            {"Withdraw"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{view()}</div>
    </div>
  );
};
