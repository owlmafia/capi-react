import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadFundsActivity, loadDao } from "./controller";
import funds from "../images/funds.svg";
import { changeArrow, shortedAddress } from "../shared_functions";
import CopyPasteText from "../common_comps/CopyPastText";
import { CompactFundsActivityEntry } from "./CompactFundsActivityEntry";
import Progress from "../app_comps/Progress";

export const FundsActivityEmbedded = ({ deps, daoId }) => {
  const [activityEntries, setActivityEntries] = useState(null);
  const [dao, setDao] = useState(null);

  useEffect(() => {
    loadFundsActivity(deps.statusMsg, daoId, setActivityEntries, "3");
  }, [daoId, deps.statusMsg]);

  useEffect(() => {
    loadDao(deps.statusMsg, daoId, setDao);
  }, [daoId, deps.statusMsg]);

  const fundsActivity = () => {
    if (activityEntries) {
      if (activityEntries.length > 0) {
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
        return null;
      }
    } else {
      return <Progress />;
    }
  };

  const box = () => {
    return (
      <div className="first_dao_widget">
        {deps.funds && (
          <div className="d-flex flex-column gap-10">
            <div className="ft-weight-600 ft-size-18">{"Project funds"}</div>
            <div className="d-flex align-center gap-10">
              <img src={funds} alt="funds" />
              <div className="ft-weight-600 ft-size-24">{deps.funds}</div>
              <div>{changeArrow(deps.fundsChange)}</div>
            </div>
          </div>
        )}
        {dao && (
          <div className="d-flex gap-10 w-100 mt-1">
            <div className="ft-color-black">
              {"Project wallet address:"}
            </div>
            <CopyPasteText
              text={shortedAddress(dao.customer_escrow_address)}
              copyText={dao.customer_escrow_address}
            />
          </div>
        )}
        {activityEntries && activityEntries.length > 0 && (
          <div>
            <div className="mt-6 ft-weight-600 mb-5 ft-size-18">
              {"Recent funds activity"}
            </div>
            {fundsActivity()}
            <Link className="see-all" to="funds_activity">
              <button className="link_button">{"See all"}</button>
            </Link>
          </div>
        )}
      </div>
    );
  };

  const view = () => {
    if (deps.funds || dao || (activityEntries && activityEntries.length > 0)) {
      return box();
    } else {
      return null;
    }
  };

  return <div>{view()}</div>;
};
