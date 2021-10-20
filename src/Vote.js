import React, { useState, useEffect } from "react";
import { signTxs } from "./MyAlgo";

const wasmPromise = import("wasm");

export const Vote = (props) => {
  const [project, setProject] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [chainInvestmentData, setChainInvestmentData] = useState(null);

  const userDataElement = () => {
    console.log("Rendering: " + userDataElement);
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
    const init = async () => {
      const {
        init_log,
        bridge_load_withdrawal_requests,
        bridge_load_project_user_view,
        bridge_load_investment,
      } = await wasmPromise;
      await init_log();

      // TODO (later) in parallel (e.g. get project, withdrawal reqs)? parallelize in rust? or here?

      console.log("loading project id: " + JSON.stringify(props.match.params));
      let project = await bridge_load_project_user_view(props.match.params.id);
      console.log("project: " + JSON.stringify(project));
      setProject(project);

      const withdrawalRequestsRes = await bridge_load_withdrawal_requests({
        project_id: props.match.params.id,
      });
      console.log(
        "withdrawalRequestsRes: " + JSON.stringify(withdrawalRequestsRes)
      );
      setWithdrawalRequests(withdrawalRequestsRes.requests);

      if (props.myAddress) {
        console.log("props.myAddress: " + props.myAddress);
        let investorData = await bridge_load_investment({
          project_id: props.match.params.id,
          app_id: project.central_app_id,
          shares_asset_id: project.share_asset_id,
          investor_address: props.myAddress,
        });
        console.log("investorData: " + JSON.stringify(investorData));
        setChainInvestmentData(investorData);
      }
    };
    init();
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
            {userDataElement()}
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
                        try {
                          const { bridge_vote, bridge_submit_vote } =
                            await wasmPromise;

                          props.showProgress(true);
                          let voteRes = await bridge_vote({
                            project_id: props.match.params.id,
                            slot_id: req.slot_id,
                            voter_address: props.myAddress,
                          });
                          // TODO update list with returned withdrawals list
                          console.log("voteRes: " + JSON.stringify(voteRes));
                          props.showProgress(false);

                          let voteSigned = await signTxs(voteRes.to_sign);

                          console.log("voteSigned: " + voteSigned);

                          props.showProgress(true);
                          let submitVoteRes = await bridge_submit_vote({
                            project_id: props.match.params.id,
                            slot_id: req.slot_id,
                            txs: voteSigned,
                            pt: voteRes.pt,
                          });

                          console.log(
                            "submitVoteRes: " + JSON.stringify(submitVoteRes)
                          );
                          props.statusMsg.success("Voted!");
                          props.showProgress(false);
                        } catch (e) {
                          props.statusMsg.error(e);
                          props.showProgress(false);
                        }
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
