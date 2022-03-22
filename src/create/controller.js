import { signTx, signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async () => {
  const { init_log } = await wasmPromise;
  await init_log();
};

export const createDao = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,

  daoName,
  daoDescr,
  shareCount,
  sharePrice,
  investorsShare,
  logoUrl,
  socialMediaUrl,
  setCreateDaoSuccess
) => {
  const {
    bridge_create_dao_assets_txs,
    bridge_create_dao,
    bridge_submit_create_dao,
  } = await wasmPromise;

  statusMsg.clear();
  showProgress(true);
  console.log("creator: " + myAddress);
  try {
    let createDaoAssetsRes = await bridge_create_dao_assets_txs({
      inputs: {
        creator: myAddress,
        dao_name: daoName,
        dao_description: daoDescr,
        share_count: shareCount,
        share_price: sharePrice,
        investors_share: investorsShare,
        logo_url: logoUrl,
        social_media_url: socialMediaUrl,
      },
    });
    showProgress(false);

    let createAssetSigned = await signTxs(createDaoAssetsRes.to_sign);
    console.log("createAssetSigned: " + JSON.stringify(createAssetSigned));

    showProgress(true);
    let createDaoRes = await bridge_create_dao({
      create_assets_signed_txs: createAssetSigned,
      pt: createDaoAssetsRes.pt,
    });
    console.log("createDaoRes: " + JSON.stringify(createDaoRes));
    showProgress(false);

    let createDaoSigned = await signTxs(createDaoRes.to_sign);
    console.log("createDaoSigned: " + JSON.stringify(createDaoSigned));

    showProgress(true);
    let submitDaoRes = await bridge_submit_create_dao({
      txs: createDaoSigned,
      pt: createDaoRes.pt, // passthrough
    });
    console.log("submitDaoRes: " + JSON.stringify(submitDaoRes));

    setCreateDaoSuccess(submitDaoRes);
    showProgress(false);
    statusMsg.success("Project created!");

    await updateMyBalance(myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
