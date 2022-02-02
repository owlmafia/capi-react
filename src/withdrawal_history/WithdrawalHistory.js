import React, { useState, useEffect } from "react";
import { init, withdraw, loadWithdrawals } from "./controller";
import { ProjectName } from "../ContentTitle";
import { WithdrawalEntry } from "../Withdrawal";
import { useParams } from "react-router-dom";

export const WithdrawalHistory = (props) => {
  let params = useParams();

  const [withdrawals, setWithdrawals] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    // TODO pass cached project (props.history.location.state)? not sure this is still needed, with the new navigation
    // init(params.id, props.history.location.state, setProject, props.statusMsg);
    init(params.id, null, setProject, props.statusMsg);
    // }, [props.history.location.state, params.id, props.statusMsg]);
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadWithdrawals(
        props.statusMsg,
        params.id,
        props.myAddress,
        setWithdrawals
      );
    }
  }, [params.id, props.statusMsg, props.myAddress]);

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

  return <div>{view()}</div>;
};
