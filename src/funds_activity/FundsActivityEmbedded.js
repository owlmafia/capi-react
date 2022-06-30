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
          <div className="d-flex flex-column gap-12">
            <div className="desc">{"Project funds"}</div>
            <div className="d-flex align-center gap-10">
              <img src={funds} alt="funds" />
              <div className="subtitle">{deps.funds}</div>
              <div>{changeArrow(deps.fundsChange)}</div>
            </div>
          </div>
        )}
        {dao && (
          <div className="project-wallet">
            <div className="ft-color-black">{"Project wallet address:"}</div>
            <CopyPasteText
              text={shortedAddress(dao.app_address)}
              copyText={dao.app_address}
              statusMsg={deps.statusMsg}
              copyMsg={"Address copied to clipboard"}
            />
          </div>
        )}
        {activityEntries && activityEntries.length > 0 && (
          <div>
            <div className="mt-6 ft-weight-600 mb-32 ft-size-18">
              {"Recent funds activity"}
            </div>
            {fundsActivity()}
            <Link className="see-all d-flex justify-center" to="funds_activity">
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
