import React, { useState, useEffect } from "react";
import { signTxs } from "./MyAlgo";

const wasmPromise = import("wasm");

export const Investment = (props) => {
  const [project, setProject] = useState(null);
  const [chainInvestmentData, setChainInvestmentData] = useState(null);
  const [youAreNotInvested, setYouAreNotInvested] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          init_log,
          bridge_load_project_user_view,
          bridge_load_investment,
        } = await wasmPromise;
        await init_log();
        console.log(
          "loading project id: " + JSON.stringify(props.match.params)
        );
        let project = await bridge_load_project_user_view(
          props.match.params.id
        );
        console.log("project: " + JSON.stringify(project));
        setProject(project);

        if (props.myAddress) {
          console.log("props.myAddress: " + props.myAddress);
          setChainInvestmentData(
            await bridge_load_investment({
              project_id: props.match.params.id,
              app_id: project.central_app_id,
              shares_asset_id: project.share_asset_id,
              investor_address: props.myAddress,
            })
          );
        }
      } catch (e) {
        if (e === "You're not invested in this project.") {
          setYouAreNotInvested(true);
        } else {
          props.statusMsg.error(e);
        }
      }
    };
    init();
  }, [props.match.params, props.myAddress, props.statusMsg]);

  const userElement = () => {
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
              try {
                const {
                  bridge_harvest,
                  bridge_submit_harvest,
                  bridge_load_investment,
                } = await wasmPromise;

                props.showProgress(true);
                let harvestRes = await bridge_harvest({
                  project_id: props.match.params.id,
                  investor_address: props.myAddress,
                });
                console.log("harvestRes: " + JSON.stringify(harvestRes));
                props.showProgress(false);

                let harvestResSigned = await signTxs(harvestRes.to_sign);
                console.log(
                  "harvestResSigned: " + JSON.stringify(harvestResSigned)
                );

                props.showProgress(true);
                let submitHarvestRes = await bridge_submit_harvest({
                  txs: harvestResSigned,
                  pt: harvestRes.pt,
                });
                console.log(
                  "submitHarvestRes: " + JSON.stringify(submitHarvestRes)
                );

                setChainInvestmentData(
                  await bridge_load_investment({
                    project_id: props.match.params.id,
                    app_id: project.central_app_id,
                    shares_asset_id: project.share_asset_id,
                    investor_address: props.myAddress,
                  })
                );

                props.statusMsg.success("Profits retrieved");
                props.showProgress(false);
              } catch (e) {
                props.statusMsg.error(e);
                props.showProgress(false);
              }
            }}
          >
            {"Retrieve profits"}
          </button>
          <br />
          <br />
          <button
            disabled={chainInvestmentData.investor_shares_count === 0}
            onClick={async () => {
              try {
                const {
                  bridge_unstake,
                  bridge_submit_unstake,
                  bridge_load_investment,
                } = await wasmPromise;

                props.showProgress(true);
                let unstakeRes = await bridge_unstake({
                  project_id: props.match.params.id,
                  investor_address: props.myAddress,
                });
                console.log("unstakeRes: " + JSON.stringify(unstakeRes));
                props.showProgress(false);

                let unstakeResSigned = await signTxs(unstakeRes.to_sign);
                console.log(
                  "unstakeResSigned: " + JSON.stringify(unstakeResSigned)
                );

                props.showProgress(true);
                let submitUnstakeRes = await bridge_submit_unstake({
                  txs: unstakeResSigned,
                  pt: unstakeRes.pt,
                });
                console.log(
                  "submitUnstakeRes: " + JSON.stringify(submitUnstakeRes)
                );

                setChainInvestmentData(
                  await bridge_load_investment({
                    project_id: props.match.params.id,
                    app_id: project.central_app_id,
                    shares_asset_id: project.share_asset_id,
                    investor_address: props.myAddress,
                  })
                );

                props.statusMsg.success("Shares unstaked");
                props.showProgress(false);
              } catch (e) {
                props.statusMsg.error(e);
                props.showProgress(false);
              }
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

  const youAreNotInvestedElement = () => {
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

  const bodyElement = () => {
    if (project) {
      return (
        <div>
          <p>{"Project name:"}</p>
          <a href={project.project_link} target="_blank" rel="noreferrer">
            {project.name}
          </a>
          {userElement()}
          {youAreNotInvestedElement()}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{bodyElement()}</div>
    </div>
  );
};
