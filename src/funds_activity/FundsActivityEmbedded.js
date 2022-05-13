import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { init, loadFundsActivity, loadDao } from "./controller";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { shortedAddress } from "../shared_functions";
import CopyPasteText from "../common_comps/CopyPastText";
import { CompactFundsActivityEntry } from "./CompactFundsActivityEntry";

export const FundsActivityEmbedded = ({
  statusMsg,
  daoId,
  myAddress,
  funds,
  fundsChange,
}) => {
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
  }, [daoId, statusMsg]);

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
        {funds && (
          <div>
            <div>{"Project funds"}</div>
            <div className="funds-assets">
              <FundsAssetImg />
            </div>
            <div>{funds}</div>
            <div>{fundsChangeArrow(fundsChange)}</div>
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
