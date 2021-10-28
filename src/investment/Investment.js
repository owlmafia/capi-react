import React, { useState, useEffect } from "react";
import { init, retrieveProfits, unstake } from "./controller";
import { ProjectName } from "../ProjectName";

export const Investment = (props) => {
  const [project, setProject] = useState(null);
  const [chainInvestmentData, setChainInvestmentData] = useState(null);
  const [youAreNotInvested, setYouAreNotInvested] = useState(false);
  const [pendingVotes, setPendingVotes] = useState("");

  useEffect(() => {
    console.log("loading project id: " + JSON.stringify(props.match.params));
    init(
      props.match.params.id,
      props.myAddress,
      props.statusMsg,
      setProject,
      setYouAreNotInvested,
      setChainInvestmentData,
      setPendingVotes
    );
  }, [props.match.params, props.myAddress, props.statusMsg]);

  const userView = () => {
    if (chainInvestmentData && !youAreNotInvested) {
      return (
        <div>
          <p>
            <span className="key-val-key">{"Your shares:"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_shares_count}
            </span>
          </p>
          <p>
            <span className="key-val-key">{"Your voting power:"}</span>
            <span className="key-val-val">
              {chainInvestmentData.investor_percentage}
            </span>
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
            className="harvest-button"
            hidden={chainInvestmentData.investor_harvestable_amount === "0"}
            onClick={async () => {
              await retrieveProfits(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.setMyBalance,
                props.match.params.id,
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
            disabled={chainInvestmentData.investor_shares_count === "0"}
            onClick={async () => {
              await unstake(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.setMyBalance,
                props.match.params.id,
                project,
                setChainInvestmentData,
                setYouAreNotInvested
              );
            }}
          >
            {"Unstake shares"}
          </button>
          {pendingVotesView()}
        </div>
      );
    } else {
      return null;
    }
  };

  const pendingVotesText = (votes) => {
    if (votes === "1") {
      return "There's " + votes + " withdrawal request waiting for your vote";
    } else {
      return (
        "There are " + votes + " withdrawal requests waiting for your vote"
      );
    }
  };

  // TODO url from wasm
  const pendingVotesView = () => {
    if (pendingVotes && pendingVotes !== "0" && project && !youAreNotInvested) {
      return (
        <div>
          <div className="section-spacer" />
          <a
            href={"http://localhost:3000/vote/" + props.match.params.id}
            target="_blank"
            rel="noreferrer"
          >
            {pendingVotesText(pendingVotes)}
          </a>
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
          <ProjectName project={project} />
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
