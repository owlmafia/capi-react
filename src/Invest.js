import React, { useState, useEffect } from "react";
import { signTxs, signTx } from "./MyAlgo";

const wasmPromise = import("wasm");

export const Invest = (props) => {
  const [project, setProject] = useState(null);
  const [buySharesCount, setBuySharesCount] = useState("");

  console.log("props: " + JSON.stringify(props));

  useEffect(() => {
    const init = async () => {
      try {
        const { init_log, bridge_load_project_user_view } = await wasmPromise;

        await init_log();
        //   console.log("loading project id: " + JSON.stringify(props.match.params));
        setProject(await bridge_load_project_user_view(props.match.params.id));
      } catch (e) {
        props.statusMsg.error(e);
      }
    };
    init();
  }, [props.match.params.id, props.statusMsg]);

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
                        bridge_opt_in_to_app_if_needed,
                        bridge_buy_shares,
                        bridge_submit_buy_shares,
                      } = await wasmPromise;

                      props.showProgress(true);
                      // 1. sign tx for app opt-in
                      // TODO ensure that both project and address are always set here, is state managed well?
                      let optInToAppRes = await bridge_opt_in_to_app_if_needed({
                        app_id: "" + project.central_app_id,
                        investor_address: props.myAddress,
                      });
                      console.log(
                        "optInToAppRes: " + JSON.stringify(optInToAppRes)
                      );
                      var optInToAppSignedOptional = null;
                      if (optInToAppRes.to_sign != null) {
                        props.showProgress(false);
                        optInToAppSignedOptional = await signTx(
                          optInToAppRes.to_sign
                        );
                      }
                      console.log(
                        "optInToAppSignedOptional: " +
                          JSON.stringify(optInToAppSignedOptional)
                      );

                      props.showProgress(true);
                      // 2. buy the shares (requires app opt-in for local state)
                      // TODO write which local state
                      let buyRes = await bridge_buy_shares({
                        project_id: props.match.params.id,
                        share_count: buySharesCount,
                        investor_address: props.myAddress,
                        app_opt_in_tx: optInToAppSignedOptional,
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
