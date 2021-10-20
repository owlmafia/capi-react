import React, { useState, useEffect } from "react";
import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const Invest = (props) => {
  const [project, setProject] = useState(null);
  const [buySharesCount, setBuySharesCount] = useState("");
  const [investorCurrentSharesCount, setInvestorCurrentSharesCount] =
    useState("");

  console.log("props: " + JSON.stringify(props));

  useEffect(() => {
    const init = async () => {
      try {
        const {
          init_log,
          bridge_load_project_user_view,
          bridge_get_user_shares_count,
        } = await wasmPromise;

        await init_log();
        //   console.log("loading project id: " + JSON.stringify(props.match.params));

        let project = await bridge_load_project_user_view(
          props.match.params.id
        );
        setProject(project);

        if (props.myAddress) {
          let owned_share_count = await bridge_get_user_shares_count({
            address: props.myAddress,
            shares_asset_id: project.share_asset_id,
          });
          console.log("Not staked shares: " + owned_share_count);
          setInvestorCurrentSharesCount(owned_share_count);
        }
      } catch (e) {
        props.statusMsg.error(e);
      }
    };
    init();
  }, [props.match.params.id, props.statusMsg, props.myAddress]);

  const yourFreeSharesElement = () => {
    // if (investorCurrentSharesCount !== "") {
    if (props.myAddress) {
      return <p>{"Unstaked shares: " + investorCurrentSharesCount}</p>;
    } else {
      return null;
    }
  };

  const projectElement = () => {
    if (project) {
      return (
        <div>
          <div className="container">
            <p>{"Project name:"}</p>
            <a href={project.project_link} target="_blank" rel="noreferrer">
              {project.name}
            </a>
            <p>{"Share supply:"}</p>
            {project.share_supply}
            <p>{"Share asset name:"}</p>
            {project.share_asset_name}
            <p>{"Share asset id:"}</p>
            <a
              href={
                "https://testnet.algoexplorer.io/asset/" +
                project.share_asset_id
              }
              target="_blank"
              rel="noreferrer"
            >
              {project.share_asset_id}
            </a>
            <p>{"Share price:"}</p>
            {project.share_price}
            <p>{"Vote threshold:"}</p>
            {project.vote_threshold}
            <div>
              <div className="input-row">
                <button
                  disabled={props.myAddress === ""}
                  onClick={async (_) => {
                    try {
                      const {
                        bridge_opt_in_to_apps_if_needed,
                        bridge_buy_shares,
                        bridge_submit_buy_shares,
                      } = await wasmPromise;
                      ///////////////////////////////////
                      // TODO refactor invest/stake
                      // 1. sign tx for app opt-in
                      props.showProgress(true);
                      let optInToAppsRes =
                        await bridge_opt_in_to_apps_if_needed({
                          app_id: "" + project.central_app_id,
                          slot_ids: project.slot_ids,
                          investor_address: props.myAddress,
                        });
                      console.log(
                        "optInToAppsRes: " + JSON.stringify(optInToAppsRes)
                      );
                      var optInToAppsSignedOptional = null;
                      if (optInToAppsRes.to_sign != null) {
                        props.showProgress(false);
                        optInToAppsSignedOptional = await signTxs(
                          optInToAppsRes.to_sign
                        );
                      }
                      console.log(
                        "optInToAppsSignedOptional: " +
                          JSON.stringify(optInToAppsSignedOptional)
                      );
                      ///////////////////////////////////

                      props.showProgress(true);
                      // 2. buy the shares (requires app opt-in for local state)
                      // TODO write which local state
                      let buyRes = await bridge_buy_shares({
                        project_id: props.match.params.id,
                        share_count: buySharesCount,
                        investor_address: props.myAddress,
                        app_opt_ins: optInToAppsSignedOptional,
                      });
                      console.log("buyRes: " + JSON.stringify(buyRes));
                      props.showProgress(false);

                      let buySharesSigned = await signTxs(buyRes.to_sign);
                      console.log(
                        "buySharesSigned: " + JSON.stringify(buySharesSigned)
                      );

                      props.showProgress(true);
                      let submitBuySharesRes = await bridge_submit_buy_shares({
                        txs: buySharesSigned,
                        pt: buyRes.pt,
                      });
                      console.log(
                        "submitBuySharesRes: " +
                          JSON.stringify(submitBuySharesRes)
                      );
                      props.showProgress(false);

                      props.showModal({
                        title: "Congratulations!",
                        body: (
                          <p>
                            <span>{"You've become an investor of "}</span>
                            <b> {project.name}</b>
                            <span>{". "}</span>
                            <button
                              onClick={(_) => {
                                props.history.push({
                                  pathname:
                                    "/investment/" + props.match.params.id,
                                  // TODO ensure project is set when calling this?
                                  state: project,
                                });
                                props.showModal(null);
                              }}
                            >
                              {"Go to your investor site"}
                            </button>
                          </p>
                        ),
                      });
                    } catch (e) {
                      props.statusMsg.error(e);
                      props.showProgress(false);
                    }
                  }}
                >
                  {"Buy"}
                </button>
                <input
                  placeholder={""}
                  className="inline"
                  size="16"
                  value={buySharesCount}
                  onChange={(event) => {
                    setBuySharesCount(event.target.value);
                  }}
                />
                <span>{"Shares"}</span>
                {/* <p>{"(" + (project.sh) + ")"}</p> */}

                <br />
                {yourFreeSharesElement()}
                <button
                  disabled={
                    props.myAddress === "" || investorCurrentSharesCount === 0
                  }
                  onClick={async () => {
                    try {
                      const {
                        bridge_stake,
                        bridge_submit_stake,
                        bridge_load_project_user_view,
                        bridge_opt_in_to_apps_if_needed,
                      } = await wasmPromise;

                      ///////////////////////////////////
                      // TODO refactor invest/stake
                      // 1. sign tx for app opt-in
                      props.showProgress(true);
                      let optInToAppRes = await bridge_opt_in_to_apps_if_needed(
                        {
                          app_id: "" + project.central_app_id,
                          slot_ids: project.slot_ids,
                          investor_address: props.myAddress,
                        }
                      );
                      console.log(
                        "optInToAppRes: " + JSON.stringify(optInToAppRes)
                      );

                      var optInToAppsSignedOptional = null;
                      if (optInToAppRes.to_sign != null) {
                        props.showProgress(false);
                        optInToAppsSignedOptional = await signTxs(
                          optInToAppRes.to_sign
                        );
                      }
                      console.log(
                        "optInToAppsSignedOptional: " +
                          JSON.stringify(optInToAppsSignedOptional)
                      );
                      ///////////////////////////////////

                      // 2. stake
                      props.showProgress(true);
                      let stakeRes = await bridge_stake({
                        project_id: props.match.params.id,
                        investor_address: props.myAddress,
                      });
                      console.log("stakeRes: " + JSON.stringify(stakeRes));
                      props.showProgress(false);

                      let stakeResSigned = await signTxs(stakeRes.to_sign);
                      console.log(
                        "stakeResSigned: " + JSON.stringify(stakeResSigned)
                      );

                      props.showProgress(true);

                      let submitStakeRes = await bridge_submit_stake({
                        app_opt_ins: optInToAppsSignedOptional,
                        txs: stakeResSigned,
                      });
                      console.log(
                        "submitStakeRes: " + JSON.stringify(submitStakeRes)
                      );

                      setProject(
                        await bridge_load_project_user_view(
                          props.match.params.id
                        )
                      );

                      props.statusMsg.success("Shares staked");
                      props.showProgress(false);

                      props.showModal({
                        title: "Success",
                        body: (
                          <p>
                            <span>{"Your shares are staked."}</span>
                            <button
                              onClick={(_) => {
                                props.history.push({
                                  pathname:
                                    "/investment/" + props.match.params.id,
                                  // TODO ensure project is set when calling this?
                                  state: project,
                                });
                                props.showModal(null);
                              }}
                            >
                              {"Go to your investor site"}
                            </button>
                          </p>
                        ),
                      });
                    } catch (e) {
                      props.statusMsg.error(e);
                      props.showProgress(false);
                    }
                  }}
                >
                  {"Stake"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{projectElement()}</div>
    </div>
  );
};
