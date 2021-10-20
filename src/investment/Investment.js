import React, { useState, useEffect } from "react";
import { init, retrieveProfits, unstake } from "./controller";

export const Investment = (props) => {
  const [project, setProject] = useState(null);
  const [chainInvestmentData, setChainInvestmentData] = useState(null);
  const [youAreNotInvested, setYouAreNotInvested] = useState(false);

  useEffect(() => {
    console.log("loading project id: " + JSON.stringify(props.match.params));
    init(
      props.match.params.id,
      props.myAddress,
      props.statusMsg,
      setProject,
      setYouAreNotInvested,
      setChainInvestmentData
    );
  }, [props.match.params, props.myAddress, props.statusMsg]);

  const userView = () => {
    if (chainInvestmentData) {
      return (
        <div>
          <div>{"Your shares:"}</div>
          <p>{chainInvestmentData.investor_shares_count}</p>

          <div>{"Your voting power:"}</div>
          <p>{chainInvestmentData.investor_percentage}</p>

          <div>{"Retrieved profits (Algo):"}</div>
          <p>{chainInvestmentData.investor_already_retrieved_amount}</p>

          <div>{"Retrievable profits (Algo):"}</div>
          <p>{chainInvestmentData.investor_harvestable_amount}</p>
          <button
            className="harvest-button"
            disabled={chainInvestmentData.investor_harvestable_amount === 0}
            onClick={async () => {
              await retrieveProfits(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.match.params.id,
                project,
                setChainInvestmentData
              );
            }}
          >
            {"Retrieve profits"}
          </button>
          <br />
          <br />
          <button
            disabled={chainInvestmentData.investor_shares_count === 0}
            onClick={async () => {
              await unstake(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.match.params.id,
                project,
                setChainInvestmentData
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
          <p>{"Project name:"}</p>
          <a href={project.project_link} target="_blank" rel="noreferrer">
            {project.name}
          </a>
          {userView()}
          {youAreNotInvestedView()}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{bodyView()}</div>
    </div>
  );
};
