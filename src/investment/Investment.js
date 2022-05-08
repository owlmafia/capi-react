import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import renderPieChart from "../charts/renderPieChart";
import { BuyMoreShares } from "./BuyMoreShares";
import { init } from "./controller";
import { updateInvestmentData_ } from "../shared_functions";
import { InvestmentProfits } from "./InvestmentProfits";
import { UnlockShares } from "./UnlockShares";
import { LockShares } from "../lockShares/LockShares";

export const Investment = (props) => {
  let params = useParams();

  const [dao, setDao] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);

  const [showBuyMoreTab, setShowBuyMoreTab] = useState(true);
  const [showUnlockTab, setShowUnlockTab] = useState(false);
  const [showLockTab, setShowLockTab] = useState(false);

  const myShareChart = useRef(null);

  // TODO repeated callback (also in app.js)
  const updateInvestmentData = useCallback(async () => {
    if (props.myAddress) {
      await updateInvestmentData_(
        props.statusMsg,
        props.myAddress,
        params.id,
        setInvestmentData
      );
    }
  }, [props.statusMsg, props.myAddress, params.id]);

  useEffect(() => {
    async function doInit() {
      await init(
        params.id,
        props.myAddress,
        props.statusMsg,
        setDao,
        updateInvestmentData,
        props.updateMyShares
      );
    }
    doInit();
  }, [
    params.id,
    props.myAddress,
    props.statusMsg,
    updateInvestmentData,
    props.updateMyShares,
  ]);

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
    if (props.myAddress && dao && investmentData) {
      return (
        <div>
          <div className="section_container">
            <InvestmentProfits
              statusMsg={props.statusMsg}
              showProgress={props.showProgress}
              updateMyShares={props.updateMyShares}
              updateMyBalance={props.updateMyBalance}
              myAddress={props.myAddress}
              investmentData={investmentData}
              updateInvestmentData={updateInvestmentData}
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
                investmentData={investmentData}
              />
            )}
            {showUnlockTab && (
              <UnlockShares
                statusMsg={props.statusMsg}
                showProgress={props.showProgress}
                myAddress={props.myAddress}
                updateMyShares={props.updateMyShares}
                updateMyBalance={props.updateMyBalance}
                updateInvestmentData={updateInvestmentData}
                dao={dao}
                daoId={params.id}
                investmentData={investmentData}
              />
            )}
            {showLockTab && (
              <LockShares
                statusMsg={props.statusMsg}
                showProgress={props.showProgress}
                myAddress={props.myAddress}
                updateMyShares={props.updateMyShares}
                updateMyBalance={props.updateMyBalance}
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
