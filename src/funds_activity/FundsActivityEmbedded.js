import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadFundsActivity, loadDao } from "./controller";
import funds from "../images/funds.svg";
import arrowUp from "../images/svg/green-arrow.svg";
import arrowDown from "../images/svg/arrow.svg";
import { shortedAddress } from "../shared_functions";
import CopyPasteText from "../common_comps/CopyPastText";
import { CompactFundsActivityEntry } from "./CompactFundsActivityEntry";
import Progress from "../app_comps/Progress";

export const FundsActivityEmbedded = ({ deps, daoId }) => {
  const [activityEntries, setActivityEntries] = useState([]);
  const [dao, setDao] = useState(null);

  useEffect(() => {
    loadFundsActivity(deps.statusMsg, daoId, setActivityEntries, "3");
  }, [daoId, deps.statusMsg]);

  useEffect(() => {
    loadDao(deps.statusMsg, daoId, setDao);
  }, [daoId, deps.statusMsg]);

  const fundsActivity = () => {
    if (activityEntries && activityEntries.length > 0) {
      return (
        <div>
          {activityEntries &&
            activityEntries.map((entry) => (
              <CompactFundsActivityEntry
                entry={entry}
                showDescr={false}
                key={entry.tx_id}
              />
            ))}
        </div>
      );
    } else {
      return <Progress />;
    }
  };

  const view = () => {
    return (
      <div className="first_dao_widget">
        {deps.funds && (
          <div className="d-flex flex-column gap-10">
            <div>{"Project funds"}</div>
            <div className="d-flex align-center gap-10">
              <img src={funds} alt="funds" />
              <div>{deps.funds}</div>
              <div>{fundsChangeArrow(deps.fundsChange)}</div>
            </div>
          </div>
        )}
        {dao && (
          <div className="d-flex gap-10 w-100 mt-1">
            <div className="ft-size-14 ft-color-black">{"Project wallet address:"}</div>
            <CopyPasteText
              text={shortedAddress(dao.customer_escrow_address)}
              copyText={dao.customer_escrow_address}
            />
          </div>
        )}
        <div className="mt-6 ft-weight-600 mb-5">{"Recent funds activity"}</div>
        {fundsActivity()}
        <Link to="funds_activity">
          <p className="link_button">{"See all"}</p>
        </Link>
      </div>
    );
  };

  return <div>{view()}</div>;
};

// TODO replace text with icons
const fundsChangeArrow = (change) => {
  if (change === "up") {
    return <div><img src={arrowUp} alt="arrow up" /></div>;
  } else if (change === "down") {
    return <div><img src={arrowDown} alt="arrow down" /></div>;
  } else {
    return null;
  }
};
