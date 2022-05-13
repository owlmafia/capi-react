import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { init, loadFundsActivity } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";

export const FundsActivity = ({ deps }) => {
  let params = useParams();

  const [activityEntries, setActivityEntries] = useState([]);

  useEffect(() => {
    init(deps.statusMsg);
  }, [deps.statusMsg]);

  useEffect(() => {
    loadFundsActivity(deps.statusMsg, params.id, setActivityEntries, null);
  }, [params.id, deps.statusMsg]);

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
