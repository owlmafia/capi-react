import React, { useState, useEffect } from "react";
import { init, withdraw, addRequest } from "./controller";
import { ProjectName } from "../ProjectName";
import { WithdrawalRequest } from "../WithdrawalRequest";

export const Withdrawal = (props) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    console.log(
      "props.history.location.state: " + props.history.location.state
    );
    init(
      props.match.params.id,
      props.history.location.state,
      setProject,
      setWithdrawalRequests,
      props.statusMsg
    );
  }, [props.history.location.state, props.match.params, props.statusMsg]);

  const withdrawalRequestsView = () => {
    if (withdrawalRequests && withdrawalRequests.length) {
      return (
        <div className="withdrawal-cell-container">
          <div className="subtitle">{"Requests"}</div>
          {withdrawalRequests &&
            withdrawalRequests.map((req) => (
              <WithdrawalRequest
                req={req}
                buttonDisabled={() => req.votes < project.vote_threshold}
                onButtonClick={async () => {
                  await withdraw(
                    props.myAddress,
                    props.showProgress,
                    props.statusMsg,
                    props.match.params.id,
                    req,
                    setWithdrawalRequests
                  );
                }}
                buttonLabel={"Withdraw"}
              />
            ))}
        </div>
      );
    } else {
      return null;
    }
  };

  const projectView = () => {
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
              await addRequest(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                project.id,
                withdrawalAmount,
                setWithdrawalRequests,
                withdrawalRequests,
                withdrawalDescr
              );
            }}
          >
            {"Request funds"}
          </button>

          {withdrawalRequestsView()}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{projectView()}</div>
    </div>
  );
};
