import React, { useState, useEffect } from "react";
import { init, withdraw, loadWithdrawals } from "./controller";
import { ProjectName } from "../ProjectName";
import { WithdrawalEntry } from "../Withdrawal";

export const Withdrawal = (props) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [withdrawals, setWithdrawals] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    init(
      props.match.params.id,
      props.history.location.state,
      setProject,
      props.statusMsg
    );
  }, [props.history.location.state, props.match.params.id, props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadWithdrawals(
        props.statusMsg,
        props.match.params.id,
        props.myAddress,
        setWithdrawals
      );
    }
  }, [props.match.params.id, props.statusMsg, props.myAddress]);

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
                props.match.params.id,
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
