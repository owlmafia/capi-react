import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import renderPieChart from "../charts/renderPieChart";
import { BuyMoreShares } from "./BuyMoreShares";
import { init } from "./controller";
import { InvestmentProfits } from "./InvestmentProfits";
import { UnlockShares } from "./UnlockShares";
import { LockShares } from "../lockShares/LockShares";

export const Investment = ({
  myAddress,
  showProgress,
  statusMsg,
  investmentData,
  updateInvestmentData,
  updateMyShares,
  updateMyBalance,
  updateFunds,
}) => {
  let params = useParams();

  const [dao, setDao] = useState(null);

  const [showBuyMoreTab, setShowBuyMoreTab] = useState(true);
  const [showUnlockTab, setShowUnlockTab] = useState(false);
  const [showLockTab, setShowLockTab] = useState(false);

  const myShareChart = useRef(null);

  useEffect(() => {
    async function doInit() {
      await init(
        params.id,
        myAddress,
        statusMsg,
        setDao,
        updateInvestmentData,
        updateMyShares
      );

      if (myAddress) {
        await updateInvestmentData(params.id, myAddress);
      }
    }
    doInit();
  }, [params.id, myAddress, statusMsg, updateInvestmentData, updateMyShares]);

  useEffect(() => {
    if (myShareChart.current && investmentData) {
      const notMyShare = 1 - investmentData.investor_percentage_number;
      // the labels are irrelevant here
      const data = {
        a: investmentData.investor_percentage_number,
        b: notMyShare,
      };
      renderPieChart(myShareChart.current, data, (d) => d[1]);
    }
  }, [dao, investmentData]);

  const userView = () => {
    if (myAddress && dao && investmentData) {
      return (
        <div>
          <div className="section_container">
            <InvestmentProfits
              statusMsg={statusMsg}
              showProgress={showProgress}
              updateMyShares={updateMyShares}
              updateMyBalance={updateMyBalance}
              myAddress={myAddress}
              investmentData={investmentData}
              updateInvestmentData={updateInvestmentData}
              updateFunds={updateFunds}
            />

            <div id="dao_actions_top_bar">
              <p
                className={actions_tabs_classes(showBuyMoreTab)}
                onClick={() => {
                  setShowUnlockTab(false);
                  setShowLockTab(false);
                  setShowBuyMoreTab((current) => !current);
                }}
              >
                {"Buy more shares"}
              </p>
              <p
                className={actions_tabs_classes(showUnlockTab)}
                onClick={() => {
                  setShowBuyMoreTab(false);
                  setShowLockTab(false);
                  setShowUnlockTab((current) => !current);
                }}
              >
                {"Unlock shares"}
              </p>
              <p
                className={actions_tabs_classes(showLockTab)}
                onClick={() => {
                  setShowBuyMoreTab(false);
                  setShowUnlockTab(false);
                  setShowLockTab((current) => !current);
                }}
              >
                {"Lock shares"}
              </p>
            </div>
            {showBuyMoreTab && (
              <BuyMoreShares
                statusMsg={statusMsg}
                showProgress={showProgress}
                updateMyShares={updateMyShares}
                updateMyBalance={updateMyBalance}
                updateFunds={updateFunds}
                myAddress={myAddress}
                dao={dao}
                investmentData={investmentData}
              />
            )}
            {showUnlockTab && (
              <UnlockShares
                statusMsg={statusMsg}
                showProgress={showProgress}
                myAddress={myAddress}
                updateMyShares={updateMyShares}
                updateMyBalance={updateMyBalance}
                updateInvestmentData={updateInvestmentData}
                dao={dao}
                daoId={params.id}
                investmentData={investmentData}
              />
            )}
            {showLockTab && (
              <LockShares
                statusMsg={statusMsg}
                showProgress={showProgress}
                myAddress={myAddress}
                updateMyShares={updateMyShares}
                updateMyBalance={updateMyBalance}
                updateInvestmentData={updateInvestmentData}
                dao={dao}
                daoId={params.id}
                investmentData={investmentData}
                onLockOpt={updateInvestmentData}
              />
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const bodyView = () => {
    if (dao) {
      return <div>{userView()}</div>;
    } else {
      return null;
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
