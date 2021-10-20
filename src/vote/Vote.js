import React, { useState, useEffect } from "react";
import { init, vote } from "./controller";
import { ProjectName } from "../ProjectName";
import { WithdrawalRequest } from "../WithdrawalRequest";

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
          <ProjectName project={project} />
          {userDataView()}
          <div className="withdrawal-cell-container">
            {withdrawalRequests &&
              withdrawalRequests.map((req) => (
                <WithdrawalRequest
                  req={req}
                  buttonDisabled={() => false}
                  onButtonClick={async () => {
                    await vote(
                      props.myAddress,
                      props.showProgress,
                      props.statusMsg,
                      props.match.params.id,
                      req
                    );
                  }}
                  buttonLabel={"Vote"}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
