import React, { useState, useEffect } from "react";
import { init, withdraw, loadWithdrawals } from "./controller";
import { ProjectName } from "../ProjectName";
import { WithdrawalEntry } from "../Withdrawal";

export const WithdrawalHistory = (props) => {
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

  const withdrawalsHistory = () => {
    return (
      withdrawals &&
      withdrawals.length > 0 && (
        <div className="withdrawal-cell-container">
          <div className="subtitle">{"History"}</div>
          {withdrawals &&
            withdrawals.map((withdrawal) => (
              <WithdrawalEntry withdrawal={withdrawal} />
            ))}
        </div>
      )
    );
  };

  const view = () => {
    return (
      project && (
        <div>
          <ProjectName project={project} />
          {withdrawalsHistory()}
        </div>
      )
    );
  };

  return (
    <div>
      <div className="container">{view()}</div>
    </div>
  );
};
