import React, { useState, useEffect } from "react";
import { init, loadFundsActivity } from "./controller";
import { ContentTitle } from "../ContentTitle";
import { Link, useParams } from "react-router-dom";
import { FundsActivityEntry } from "./FundsActivityEntry";
import { LabeledBox } from "../common_comps/LabeledBox";

export const FundsActivityEmbedded = ({ statusMsg, projectId, myAddress }) => {
  const [activityEntries, setActivityEntries] = useState([]);

  useEffect(() => {
    init(projectId);
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
      <div class="first_project_widget">
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
