import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import renderPieChart from "../charts/renderPieChart";
import { ContentTitle } from "../ContentTitle";
import { StakeEmbedded } from "../stakeEmbedded/StakeEmbedded";
import { init, retrieveProfits, unstake } from "./controller";

export const Investment = (props) => {
  let params = useParams();

  const [project, setProject] = useState(null);
  const [chainInvestmentData, setChainInvestmentData] = useState(null);
  const [youAreNotInvested, setYouAreNotInvested] = useState(false);
  const myShareChart = useRef(null);

  useEffect(() => {
    console.log("loading project id: " + JSON.stringify(params));
    init(
      params.id,
      props.myAddress,
      props.statusMsg,
      setProject,
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
  }, [project, chainInvestmentData, myShareChart.current]);

  const userView = () => {
    if (chainInvestmentData && !youAreNotInvested) {
      return (
        <div>
          <p>
            <span className="key-val-key">{"Your staked shares:"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_shares_count}
            </span>
            <div>
              <svg width={200} height={200} ref={myShareChart} />
            </div>
          </p>
          <p>
            {"You're entitled to " +
              chainInvestmentData.investor_percentage +
              " of the project's funds"}
          </p>
          <p>
            <span className="key-val-key">{"Retrieved profits (Algo):"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_already_retrieved_amount}
            </span>
          </p>
          <p>
            <span className="key-val-key">{"Retrievable profits (Algo):"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_harvestable_amount}
            </span>
          </p>

          <button
            className="button__submit"
            hidden={chainInvestmentData.investor_harvestable_amount === "0"}
            onClick={async () => {
              await retrieveProfits(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.setMyBalance,
                params.id,
                project,
                chainInvestmentData.investor_harvestable_amount_microalgos,
                setChainInvestmentData
              );
            }}
          >
            {"Retrieve profits"}
          </button>
          <br />
          <br />
          <button
            className="button__submit"
            disabled={chainInvestmentData.investor_shares_count === "0"}
            onClick={async () => {
              await unstake(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.setMyBalance,
                params.id,
                project,
                setChainInvestmentData,
                setYouAreNotInvested
              );
            }}
          >
            {"Unstake shares"}
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
          <a href={project.invest_link}>{"Invest"}</a>
        </div>
      );
    } else {
      return null;
    }
  };

  const bodyView = () => {
    if (project) {
      return (
        <div>
          {userView()}
          {youAreNotInvestedView()}
          <StakeEmbedded
            showProgress={props.showProgress}
            statusMsg={props.statusMsg}
            setMyBalance={props.setMyBalance}
            myAddress={props.myAddress}
            project={project}
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
