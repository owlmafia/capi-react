import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { loadFundsActivity } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";
import Progress from "../app_comps/Progress";

export const FundsActivity = ({ deps }) => {
  let params = useParams();

  const [activityEntries, setActivityEntries] = useState([]);

  useEffect(() => {
    loadFundsActivity(deps.statusMsg, params.id, setActivityEntries, null);
  }, [params.id, deps.statusMsg]);

  const fundsActivity = () => {
    if (activityEntries && activityEntries.length > 0) {
      return (
        <div>
          {activityEntries &&
            activityEntries.map((entry) => (
              <FundsActivityEntry entry={entry} showDescr={true} />
            ))}
        </div>
      );
    } else {
      return <Progress />;
    }
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
