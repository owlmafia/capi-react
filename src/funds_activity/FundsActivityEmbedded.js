import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LabeledBox } from "../common_comps/LabeledBox";
import { init, loadFundsActivity } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";

export const FundsActivityEmbedded = ({ statusMsg, projectId, myAddress }) => {
  const [activityEntries, setActivityEntries] = useState([]);

  useEffect(() => {
    init(statusMsg);
  }, [statusMsg]);

  useEffect(() => {
    if (myAddress) {
      loadFundsActivity(
        statusMsg,
        projectId,
        myAddress,
        setActivityEntries,
        "3"
      );
    }
  }, [projectId, statusMsg, myAddress]);

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
      <div className="first_project_widget">
        <LabeledBox label="Recent funds activity">
          {fundsActivity()}
          <Link to="funds_activity">
            <p className="link_button">{"Show all"}</p>
          </Link>
        </LabeledBox>
      </div>
    );
  };

  return <div>{view()}</div>;
};
