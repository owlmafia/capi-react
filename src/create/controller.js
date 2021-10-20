import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async () => {
  const { init_log } = await wasmPromise;
  await init_log();
};

export const createProject = async (
  myAddress,
  showProgress,
  statusMsg,

  projectName,
  shareCount,
  sharePrice,
  setCreateProjectSuccess
) => {
  const {
    bridge_create_project_assets_txs,
    bridge_create_project,
    bridge_submit_create_project,
  } = await wasmPromise;

  showProgress(true);
  console.log("creator: " + myAddress);
  try {
    let createProjectAssetsRes = await bridge_create_project_assets_txs({
      creator: myAddress,
      // token_name: shareName,
      token_name:
        projectName.length > 7 ? projectName.substring(0, 7) : projectName,
      count: shareCount,
      // passed here only for validation (so it's validated before signing the asset txs).
      // it's passed again and used in the next step
      asset_price: sharePrice,
    });
    showProgress(false);

    let createAssetSigned = await signTxs(createProjectAssetsRes.to_sign);
    console.log("createAssetSigned: " + JSON.stringify(createAssetSigned));

    showProgress(true);
    let createProjectRes = await bridge_create_project({
      name: projectName,
      creator: myAddress,
      asset_specs: createProjectAssetsRes.asset_spec, // passthrough
      asset_price: sharePrice,
      // for now harcoded to keep settings easy to understand
      // it probably should be under "advanced" or similar later
      vote_threshold: "70",
      create_assets_signed_txs: createAssetSigned,
    });
    console.log("createProjectRes: " + JSON.stringify(createProjectRes));
    showProgress(false);

    let createProjectSigned = await signTxs(createProjectRes.to_sign);
    console.log("createProjectSigned: " + JSON.stringify(createProjectSigned));

    showProgress(true);
    let submitProjectRes = await bridge_submit_create_project({
      txs: createProjectSigned,
      pt: createProjectRes.pt, // passthrough
    });

    console.log("submitProjectRes: " + JSON.stringify(submitProjectRes));

    setCreateProjectSuccess(submitProjectRes);
    showProgress(false);
    statusMsg.success("Project created!");
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
