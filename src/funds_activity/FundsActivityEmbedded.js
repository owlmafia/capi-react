import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { init, loadFundsActivity, loadDao } from "./controller";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { shortedAddress } from "../shared_functions";
import CopyPasteText from "../common_comps/CopyPastText";
import { CompactFundsActivityEntry } from "./CompactFundsActivityEntry";

export const FundsActivityEmbedded = ({ deps, daoId }) => {
  const [activityEntries, setActivityEntries] = useState([]);
  const [dao, setDao] = useState(null);

  useEffect(() => {
    init(deps.statusMsg);
  }, [deps.statusMsg]);

  useEffect(() => {
    loadFundsActivity(deps.statusMsg, daoId, setActivityEntries, "3");
  }, [daoId, deps.statusMsg]);

  useEffect(() => {
    loadDao(deps.statusMsg, daoId, setDao);
  }, [daoId, deps.statusMsg]);

  const fundsActivity = () => {
    return (
      activityEntries &&
      activityEntries.length > 0 && (
        <div>
          {activityEntries &&
            activityEntries.map((entry) => (
              <CompactFundsActivityEntry entry={entry} showDescr={false} />
            ))}
        </div>
      )
    );
  };

  const view = () => {
    return (
      <div className="first_dao_widget">
        {deps.funds && (
          <div>
            <div>{"Project funds"}</div>
            <div className="funds-assets">
              <FundsAssetImg />
            </div>
            <div>{deps.funds}</div>
            <div>{fundsChangeArrow(deps.fundsChange)}</div>
          </div>
        )}
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

// TODO replace text with icons
const fundsChangeArrow = (change) => {
  if (change === "up") {
    return <div>{"<up arrow>"}</div>;
  } else if (change === "down") {
    return <div>{"<down arrow>"}</div>;
  } else {
    return null;
  }
};
