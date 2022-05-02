import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LabeledBox } from "../common_comps/LabeledBox";
import { init, loadFundsActivity } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";
import { FundsAssetImg } from "../images/FundsAssetImg";

export const FundsActivityEmbedded = ({ statusMsg, daoId, myAddress }) => {
  const [activityEntries, setActivityEntries] = useState([]);

  useEffect(() => {
    init(statusMsg);
  }, [statusMsg]);

  useEffect(() => {
    if (myAddress) {
      loadFundsActivity(statusMsg, daoId, myAddress, setActivityEntries, "3");
    }
  }, [daoId, statusMsg, myAddress]);

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
      <div className="first_dao_widget">
        <LabeledBox label="Project funds">
          <div className="funds-assets"><FundsAssetImg /></div>
          <div>12252.6444</div>
          <button className="button-primary full-width-btn">Become investor</button>
        </LabeledBox>
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
