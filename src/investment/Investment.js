import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuyMoreShares } from "./BuyMoreShares";
import { init } from "./controller";
import { InvestmentProfits } from "./InvestmentProfits";
import { UnlockShares } from "./UnlockShares";
import { LockShares } from "../lockShares/LockShares";
import Progress from "../common_comps/Progress";
import { ContentTitle } from "../ContentTitle";

export const Investment = ({ deps }) => {
  let params = useParams();

  const [dao, setDao] = useState(null);

  const [showBuyMoreTab, setShowBuyMoreTab] = useState(true);
  const [showUnlockTab, setShowUnlockTab] = useState(false);
  const [showLockTab, setShowLockTab] = useState(false);

  useEffect(() => {
    async function doInit() {
      await init(
        deps.statusMsg,
        deps.myAddress,
        deps.updateInvestmentData,
        deps.updateMyShares,

        params.id,
        setDao
      );

      if (deps.myAddress) {
        await deps.updateInvestmentData.call(null, params.id, deps.myAddress);
      }
    }
    doInit();
  }, [
    params.id,
    deps.myAddress,
    deps.statusMsg,
    deps.updateInvestmentData,
    deps.updateMyShares,
  ]);

  const userView = () => {
    if (deps.myAddress && dao && deps.investmentData) {
      return (
        <div>
          <div className="section_container">
            {deps.features.prospectus && (
              <div>
                <a href={deps.dao.prospectus_url}>
                  {"Acknowledged prospectus"}
                </a>
              </div>
            )}

            <ContentTitle title={"My investment"} />

            {deps.features.stillRaisingFundsLabels &&
              dao.funds_raised === "false" && (
                <div>
                  {
                    "The project is still raising funds. Some features are disabled."
                  }
                </div>
              )}

            <InvestmentProfits deps={deps} />

            <div id="dao_actions_top_bar">
              <p
                className={actions_tabs_classes(showBuyMoreTab)}
                onClick={() => {
                  setShowUnlockTab(false);
                  setShowLockTab(false);
                  setShowBuyMoreTab((current) => !current);
                }}
              >
                {"Buy more"}
              </p>
              <p
                className={actions_tabs_classes(showUnlockTab)}
                onClick={() => {
                  setShowBuyMoreTab(false);
                  setShowLockTab(false);
                  setShowUnlockTab((current) => !current);
                }}
              >
                {"Unlock"}
              </p>
              <p
                className={actions_tabs_classes(showLockTab)}
                onClick={() => {
                  setShowBuyMoreTab(false);
                  setShowUnlockTab(false);
                  setShowLockTab((current) => !current);
                }}
              >
                {"Lock"}
              </p>
            </div>
            {showBuyMoreTab && <BuyMoreShares deps={deps} dao={dao} />}
            {showUnlockTab && (
              <UnlockShares deps={deps} dao={dao} daoId={params.id} />
            )}
            {showLockTab && (
              <LockShares
                deps={deps}
                dao={dao}
                daoId={params.id}
                onLockOpt={deps.updateInvestmentData}
              />
            )}
          </div>
        </div>
      );
    } else {
      return <Progress />;
    }
  };

  const bodyView = () => {
    if (dao) {
      return <div>{userView()}</div>;
    } else {
      return <Progress />;
    }
  };

  return (
    <div>
      <div>{bodyView()}</div>
    </div>
  );
};

const actions_tabs_classes = (tabIsShowing) => {
  var clazz = "link_button";
  if (tabIsShowing) {
    clazz += " dao_action_tab_item__sel";
  }
  return clazz;
};
