import React, { useState, useEffect } from "react";
import { init, vote } from "./controller";

export const Vote = (props) => {
  const [project, setProject] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [chainInvestmentData, setChainInvestmentData] = useState(null);

  const userDataView = () => {
    console.log("Rendering: " + userDataView);
    if (chainInvestmentData) {
      return (
        <div>
          <div>{"Your voting power:"}</div>
          <p>{chainInvestmentData.investor_percentage}</p>
        </div>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    console.log("loading project id: " + JSON.stringify(props.match.params));
    init(
      props.match.params.id,
      props.myAddress,
      setProject,
      setWithdrawalRequests,
      setChainInvestmentData
    );
  }, [props.match.params, props.myAddress]);

  return (
    <div>
      <div className="container">
        <div>
          <div className="container">
            <p>{"Project name:"}</p>
            <a href={project.project_link} target="_blank" rel="noreferrer">
              {project.name}
            </a>
            {userDataView()}
            <div className="withdrawal-cell-container">
              {withdrawalRequests &&
                withdrawalRequests.map((req) => (
                  // TODO db id maybe? - or ensure backend uses this as unique
                  <div
                    key={req.date + req.description}
                    className="withdrawal-cell"
                  >
                    {/* maybe format the date in JS? not sure we want to internationalize wasm */}
                    <p>{"Date: " + req.date}</p>
                    <p>{"Amount: " + req.amount}</p>
                    <p>{"Description: " + req.description}</p>
                    <p>{"Votes: " + req.votes}</p>
                    <p>{"Complete: " + req.complete}</p>
                    <button
                      disabled={props.myAddress === ""}
                      onClick={async () => {
                        await vote(
                          props.myAddress,
                          props.showProgress,
                          props.statusMsg,
                          props.match.params.id,
                          req
                        );
                      }}
                    >
                      {"Vote"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
