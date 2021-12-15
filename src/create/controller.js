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
  setMyBalance,

  projectName,
  shareCount,
  sharePrice,
  investorsShare,
  setCreateProjectSuccess
) => {
  const {
    bridge_create_project_assets_txs,
    bridge_create_project,
    bridge_submit_create_project,
    bridge_balance,
  } = await wasmPromise;

  statusMsg.clear();
  showProgress(true);
  console.log("creator: " + myAddress);
  try {
    let createProjectAssetsRes = await bridge_create_project_assets_txs({
      inputs: {
        creator: myAddress,
        project_name: projectName,
        share_count: shareCount,
        asset_price: sharePrice,
        investors_share: investorsShare,
      },
    });
    showProgress(false);

    let createAssetSigned = await signTxs(createProjectAssetsRes.to_sign);
    console.log("createAssetSigned: " + JSON.stringify(createAssetSigned));

    showProgress(true);
    let createProjectRes = await bridge_create_project({
      create_assets_signed_txs: createAssetSigned,
      pt: createProjectAssetsRes.pt,
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

    const balance = await bridge_balance({ address: myAddress });
    setMyBalance(balance.balance);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
