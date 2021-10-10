import React, { useState, useEffect } from "react";
import { CreateProjectSuccess } from "./CreateProjectSuccess";
import { signTxs } from "./MyAlgo";

const wasmPromise = import("wasm");

export const CreateProject = (props) => {
  const [projectName, setProjectName] = useState("my1project");
  const [shareName, setShareName] = useState("foo");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [createProjectSuccess, setCreateProjectSuccess] = useState(null);

  console.log("props: " + JSON.stringify(props));

  useEffect(() => {
    const init = async () => {
      const { init_log } = await wasmPromise;
      await init_log();
    };

    init();
  }, []);

  const formElement = () => {
    if (props.myAddress) {
      return (
        <div>
          <div>{"Project name"}</div>
          <input
            placeholder=""
            className="address-input"
            size="64"
            value={projectName}
            onChange={(event) => {
              setProjectName(event.target.value);
            }}
          />
          {/* <div>{"Share asset name"}</div>
          <input
            placeholder=""
            className="address-input"
            size="10"
            value={shareName}
            onChange={(event) => {
              setShareName(event.target.value);
            }}
          /> */}
          <div>{"Share total supply"}</div>
          <input
            placeholder=""
            className="address-input"
            size="10"
            value={shareCount}
            onChange={(event) => {
              setShareCount(event.target.value);
            }}
          />
          <div>{"Share price per unit (Algo)"}</div>
          <input
            placeholder=""
            className="address-input"
            size="10"
            value={sharePrice}
            onChange={(event) => {
              setSharePrice(event.target.value);
            }}
          />

          <button
            className="submit-button"
            disabled={
              props.myAddress === "" ||
              projectName === "" ||
              shareName === "" ||
              shareCount === "" ||
              sharePrice === ""
            }
            onClick={async () => {
              const {
                bridge_create_project_assets_txs,
                bridge_create_project,
                bridge_submit_create_project,
              } = await wasmPromise;

              console.log("creator: " + props.myAddress);
              try {
                let createProjectAssetsRes =
                  await bridge_create_project_assets_txs({
                    creator: props.myAddress,
                    // token_name: shareName,
                    token_name:
                      projectName.length > 7
                        ? projectName.substring(0, 7)
                        : projectName,
                    count: shareCount,
                    // passed here only for validation (so it's validated before signing the asset txs).
                    // it's passed again and used in the next step
                    asset_price: sharePrice,
                  });

                let createAssetSigned = await signTxs(
                  createProjectAssetsRes.to_sign
                );
                console.log(
                  "createAssetSigned: " + JSON.stringify(createAssetSigned)
                );

                let createProjectRes = await bridge_create_project({
                  name: projectName,
                  creator: props.myAddress,
                  asset_specs: createProjectAssetsRes.asset_spec, // passthrough
                  asset_price: sharePrice,
                  // for now harcoded to keep settings easy to understand
                  // it probably should be under "advanced" or similar later
                  vote_threshold: "70",
                  create_assets_signed_txs: createAssetSigned,
                });
                console.log(
                  "createProjectRes: " + JSON.stringify(createProjectRes)
                );

                let createProjectSigned = await signTxs(
                  createProjectRes.to_sign
                );
                console.log(
                  "createProjectSigned: " + JSON.stringify(createProjectSigned)
                );

                let submitProjectRes = await bridge_submit_create_project({
                  txs: createProjectSigned,
                  pt: createProjectRes.pt, // passthrough
                });

                console.log(
                  "submitProjectRes: " + JSON.stringify(submitProjectRes)
                );

                setCreateProjectSuccess(submitProjectRes);
              } catch (e) {
                props.statusMsg.error(e);
              }
            }}
          >
            {"Submit project"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const bodyElement = () => {
    if (createProjectSuccess) {
      return (
        <CreateProjectSuccess
          project={createProjectSuccess}
          showModal={props.showModal}
        />
      );
    } else {
      return formElement();
    }
  };

  return (
    <div>
      <div className="container">{bodyElement()}</div>
    </div>
  );
};
