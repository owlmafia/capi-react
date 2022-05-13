import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { init, loadFundsActivity } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";

export const FundsActivity = (props) => {
  let params = useParams();

  const [activityEntries, setActivityEntries] = useState([]);

  useEffect(() => {
    init(props.statusMsg);
  }, [props.statusMsg]);

  useEffect(() => {
    loadFundsActivity(props.statusMsg, params.id, setActivityEntries, null);
  }, [params.id, props.statusMsg]);

  const fundsActivity = () => {
    return (
      activityEntries &&
      activityEntries.length > 0 && (
        <div>
          {activityEntries &&
            activityEntries.map((entry) => (
              <FundsActivityEntry entry={entry} showDescr={true} />
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

  return <div>{view()}</div>;
};
