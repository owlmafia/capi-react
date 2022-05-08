import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import renderPieChart from "../charts/renderPieChart";
import { BuyMoreShares } from "./BuyMoreShares";
import { init } from "./controller";
import { InvestmentProfits } from "./InvestmentProfits";
import { UnlockShares } from "./UnlockShares";
import { LockShares } from "../lockShares/LockShares";

export const Investment = (props) => {
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
        props.myAddress,
        props.statusMsg,
        setDao,
        props.updateInvestmentData,
        props.updateMyShares
      );

      if (props.myAddress) {
        await props.updateInvestmentData(params.id, props.myAddress);
      }
    }
    doInit();
  }, [
    params.id,
    props.myAddress,
    props.statusMsg,
    props.updateInvestmentData,
    props.updateMyShares,
  ]);

  useEffect(() => {
    if (myShareChart.current && props.investmentData) {
      const notMyShare = 1 - props.investmentData.investor_percentage_number;
      // the labels are irrelevant here
      const data = {
        a: props.investmentData.investor_percentage_number,
        b: notMyShare,
      };
      renderPieChart(myShareChart.current, data, (d) => d[1]);
    }
  }, [dao, props.investmentData]);

  const userView = () => {
    if (props.myAddress && dao && props.investmentData) {
      return (
        <div>
          <div className="section_container">
            <InvestmentProfits
              statusMsg={props.statusMsg}
              showProgress={props.showProgress}
              updateMyShares={props.updateMyShares}
              updateMyBalance={props.updateMyBalance}
              myAddress={props.myAddress}
              investmentData={props.investmentData}
              updateInvestmentData={props.updateInvestmentData}
              updateFunds={props.updateFunds}
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
                statusMsg={props.statusMsg}
                showProgress={props.showProgress}
                updateMyShares={props.updateMyShares}
                updateMyBalance={props.updateMyBalance}
                updateFunds={props.updateFunds}
                myAddress={props.myAddress}
                dao={dao}
                investmentData={props.investmentData}
              />
            )}
            {showUnlockTab && (
              <UnlockShares
                statusMsg={props.statusMsg}
                showProgress={props.showProgress}
                myAddress={props.myAddress}
                updateMyShares={props.updateMyShares}
                updateMyBalance={props.updateMyBalance}
                updateInvestmentData={props.updateInvestmentData}
                dao={dao}
                daoId={params.id}
                investmentData={props.investmentData}
              />
            )}
            {showLockTab && (
              <LockShares
                statusMsg={props.statusMsg}
                showProgress={props.showProgress}
                myAddress={props.myAddress}
                updateMyShares={props.updateMyShares}
                updateMyBalance={props.updateMyBalance}
                updateInvestmentData={props.updateInvestmentData}
                dao={dao}
                daoId={params.id}
                investmentData={props.investmentData}
                onLockOpt={props.updateInvestmentData}
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
