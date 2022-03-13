import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DaoName } from "../ContentTitle";
import { WithdrawalEntry } from "../Withdrawal";
import { init, loadWithdrawals } from "./controller";

export const WithdrawalHistory = (props) => {
  let params = useParams();

  const [withdrawals, setWithdrawals] = useState([]);
  const [dao, setDao] = useState(null);

  useEffect(() => {
    // TODO pass cached dao (props.history.location.state)? not sure this is still needed, with the new navigation
    // init(params.id, props.history.location.state, setDao, props.statusMsg);
    init(params.id, null, setDao, props.statusMsg);
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
      dao && (
        <div>
          <DaoName dao={dao} />
          {withdrawalsHistory()}
        </div>
      )
    );
  };

  return <div>{view()}</div>;
};
