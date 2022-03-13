import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import renderPieChart from "../charts/renderPieChart";
import { ContentTitle } from "../ContentTitle";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { LockEmbedded } from "../lockEmbedded/LockEmbedded";
import { init, retrieveProfits, unlock } from "./controller";

export const Investment = (props) => {
  let params = useParams();

  const [dao, setDao] = useState(null);
  const [chainInvestmentData, setChainInvestmentData] = useState(null);
  const [youAreNotInvested, setYouAreNotInvested] = useState(false);
  const myShareChart = useRef(null);

  useEffect(() => {
    init(
      params.id,
      props.myAddress,
      props.statusMsg,
      setDao,
      setYouAreNotInvested,
      setChainInvestmentData
    );
  }, [params.id, props.myAddress, props.statusMsg]);

  useEffect(() => {
    if (myShareChart.current && chainInvestmentData) {
      const notMyShare = 1 - chainInvestmentData.investor_percentage_number;
      // the labels are irrelevant here
      const data = {
        a: chainInvestmentData.investor_percentage_number,
        b: notMyShare,
      };
      renderPieChart(myShareChart.current, data, (d) => d[1]);
    }
  }, [dao, chainInvestmentData]);

  const userView = () => {
    if (chainInvestmentData && !youAreNotInvested) {
      return (
        <div>
          <div className="section_container">
            <span className="key-val-key">{"Your locked shares:"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_shares_count}
            </span>
          </div>
          <div>
            <svg width={200} height={200} ref={myShareChart} />
          </div>
          <p className="section_container">
            {"You're entitled to " +
              chainInvestmentData.investor_percentage +
              " of the investor's share"}
          </p>
          <p className="section_container text_with_currency section_small_bottom">
            <span className="key-val-key">{"Retrieved profits:"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_already_retrieved_amount}
            </span>
            <FundsAssetImg />
          </p>
          <p className="section_container text_with_currency section_large_bottom">
            <span className="key-val-key">{"Retrievable profits:"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_harvestable_amount}
            </span>
            <FundsAssetImg />
          </p>

          <button
            className="button__submit"
            hidden={chainInvestmentData.investor_harvestable_amount === "0"}
            onClick={async () => {
              await retrieveProfits(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.updateMyBalance,
                params.id,
                dao,
                chainInvestmentData.investor_harvestable_amount_microalgos,
                setChainInvestmentData
              );
            }}
          >
            {"Retrieve profits"}
          </button>
          <button
            className="button__submit"
            disabled={chainInvestmentData.investor_shares_count === "0"}
            onClick={async () => {
              await unlock(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.updateMyBalance,
                params.id,
                dao,
                setChainInvestmentData,
                setYouAreNotInvested
              );
            }}
          >
            {"Unlock shares"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const youAreNotInvestedView = () => {
    if (youAreNotInvested) {
      return (
        <div>
          <p>{"You're not invested in this project"}</p>
          <a href={dao.invest_link}>{"Invest"}</a>
        </div>
      );
    } else {
      return null;
    }
  };

  const bodyView = () => {
    if (dao) {
      return (
        <div>
          {userView()}
          {youAreNotInvestedView()}
          <LockEmbedded
            showProgress={props.showProgress}
            statusMsg={props.statusMsg}
            updateMyBalance={props.updateMyBalance}
            myAddress={props.myAddress}
            dao={dao}
            updateMyShares={props.updateMyShares}
            myShares={props.myShares}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <ContentTitle title={"My investment"} />
      <div>{bodyView()}</div>
    </div>
  );
};
