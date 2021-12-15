import React, { useState, useEffect } from "react";
import { init, withdraw, addRequest } from "./controller";
import { ProjectName } from "../ProjectName";
import { WithdrawalEntry } from "../Withdrawal";

export const Withdrawal = (props) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [withdrawals, setWithdrawals] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    console.log(
      "props.history.location.state: " + props.history.location.state
    );
    init(
      props.match.params.id,
      props.history.location.state,
      setProject,
      setWithdrawals,
      props.statusMsg
    );
  }, [props.history.location.state, props.match.params, props.statusMsg]);

  const withdrawalsView = () => {
    if (withdrawals && withdrawals.length) {
      return (
        <div className="withdrawal-cell-container">
          <div className="subtitle">{"History"}</div>
          {withdrawals &&
            withdrawals.map((withdrawal) => (
              <WithdrawalEntry withdrawal={withdrawal} />
            ))}
        </div>
      );
    } else {
      return null;
    }
  };

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
                project.id,
                withdrawalAmount,
                setWithdrawals,
                withdrawals,
                withdrawalDescr
              );
            }}
          >
            {"Withdraw"}
          </button>

          {withdrawalsView()}
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
