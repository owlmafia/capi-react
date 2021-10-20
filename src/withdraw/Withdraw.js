import React, { useState, useEffect } from "react";
import { init, withdraw, addRequest } from "./controller";

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

  const withdrawButtonView = (req) => {
    if (req.can_withdraw) {
      return (
        <div>
          <button
            disabled={req.votes < project.vote_threshold}
            onClick={async () => {
              await withdraw(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.match.params.id,
                req,
                setWithdrawalRequests
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

  const projectView = () => {
    if (project) {
      return (
        <div>
          <p>{"Project name:"}</p>
          <a href={project.project_link} target="_blank" rel="noreferrer">
            {project.name}
          </a>
          <p>{"How much (Algo)?"}</p>
          <input
            placeholder=""
            className="address-input"
            size="64"
            value={withdrawalAmount}
            onChange={(event) => {
              setWithdrawalAmount(event.target.value);
            }}
          />
          <p>{"For what?"}</p>
          <input
            placeholder=""
            className="address-input"
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
            {"Submit"}
          </button>
          <div className="withdrawal-cell-container">
            {withdrawalRequests &&
              withdrawalRequests.map((req) => (
                // TODO db id maybe? - or ensure backend uses this as unique
                <div
                  key={req.date + req.description}
                  className="withdrawal-cell"
                >
                  {/* maybe format the date in JS? not sure we want to internationalize wasm */}
                  <p>{"Date: " + req.date}</p>
                  <p>{"Amount: " + req.amount}</p>
                  <p>{"Description: " + req.description}</p>
                  <p>{"Votes: " + req.votes}</p>
                  <p>{"Complete: " + req.complete}</p>
                  {withdrawButtonView(req)}
                </div>
              ))}
          </div>
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
