import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { init, loadFundsActivity, loadDao } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { shortedAddress } from "../shared_functions";
import CopyPasteText from "../common_comps/CopyPastText";

export const FundsActivityEmbedded = ({ statusMsg, daoId, myAddress }) => {
  const [activityEntries, setActivityEntries] = useState([]);
  const [dao, setDao] = useState(null);

  useEffect(() => {
    init(statusMsg);
  }, [statusMsg]);

  useEffect(() => {
    if (myAddress) {
      loadFundsActivity(statusMsg, daoId, myAddress, setActivityEntries, "3");
    }
  }, [daoId, statusMsg, myAddress]);

  useEffect(() => {
    loadDao(statusMsg, daoId, setDao);
  }, [daoId]);

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
        <div>{"Project funds"}</div>
        <div className="funds-assets">
          <FundsAssetImg />
        </div>
        <div>12252.6444</div>
        {dao && (
          <div>
            <div>{"Project wallet address:"}</div>
            <CopyPasteText
              text={shortedAddress(dao.customer_escrow_address)}
              copyText={dao.customer_escrow_address}
            />
          </div>
        )}
        <div>{"Recent funds activity"}</div>
        {fundsActivity()}
        <Link to="funds_activity">
          <p className="link_button">{"Show all"}</p>
        </Link>
      </div>
    );
  };

  return <div>{view()}</div>;
};
