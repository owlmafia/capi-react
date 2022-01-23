import React, { useState, useEffect } from "react";
import { init, withdraw } from "./controller";
import { ProjectName } from "../ProjectName";
import { useParams } from "react-router-dom";

export const Withdrawal = (props) => {
  let params = useParams();

  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [project, setProject] = useState(null);

  useEffect(() => {
    // TODO pass cached project (props.history.location.state)? not sure this is still needed, with the new navigation
    // init(params.id, props.history.location.state, setProject, props.statusMsg);
    init(params.id, null, setProject, props.statusMsg);
    // }, [props.history.location.state, params.id, props.statusMsg]);
  }, [params.id, props.statusMsg]);

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
                params.id,
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
