import React, { useState, useEffect } from "react";
import { init, loadFundsActivity } from "./controller";
import { ContentTitle } from "../ContentTitle";
import { useParams } from "react-router-dom";
import { FundsActivityEntry } from "./FundsActivityEntry";

export const FundsActivity = (props) => {
  let params = useParams();

  const [activityEntries, setActivityEntries] = useState([]);

  useEffect(() => {
    init(params.id);
  }, [props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadFundsActivity(
        props.statusMsg,
        params.id,
        props.myAddress,
        setActivityEntries
      );
    }
  }, [params.id, props.statusMsg, props.myAddress]);

  const fundsActivity = () => {
    return (
      activityEntries &&
      activityEntries.length > 0 && (
        <div>
          {activityEntries &&
            activityEntries.map((entry) => (
              <FundsActivityEntry entry={entry} />
            ))}
        </div>
      )
    );
  };

  const view = () => {
    return (
        <div>
          <ContentTitle title={"Funds activity"} />
          {fundsActivity()}
        </div>
    );
  };

  return (
    <div>
      <div className="container">{view()}</div>
    </div>
  );
};
