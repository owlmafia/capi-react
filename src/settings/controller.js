import { signTx } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const prefillInputs = async (
  statusMsg,
  daoId,
  setDaoName,
  setDaoDescr,
  setSharePrice,
  setLogoUrl,
  setSocialMediaUrl,
  setCentralEscrow,
  setCustomerEscrow,
  setInvestingEscrow,
  setLockingEscrow,
  setOwner
) => {
  try {
    const { bridge_updatable_data } = await wasmPromise;

    // prefill dao inputs
    let updatableData = await bridge_updatable_data({ dao_id: daoId });
    setDaoName(updatableData.project_name);
    setDaoDescr(updatableData.project_desc);
    setSharePrice(updatableData.share_price);
    setLogoUrl(updatableData.logo_url);
    setSocialMediaUrl(updatableData.social_media_url);
    setCentralEscrow(updatableData.central_escrow);
    setCustomerEscrow(updatableData.customer_escrow);
    setInvestingEscrow(updatableData.investing_escrow);
    setLockingEscrow(updatableData.locking_escrow);
    setOwner(updatableData.owner);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateApp = async (
  statusMsg,
  showProgress,
  daoId,
  owner,
  approvalVersion,
  clearVersion
) => {
  try {
    const { bridge_update_app_txs, bridge_submit_update_app } =
      await wasmPromise;

    showProgress(true);
    let updateAppRes = await bridge_update_app_txs({
      dao_id: daoId,
      owner: owner,
      approval_version: approvalVersion,
      clear_version: clearVersion,
    });
    console.log("Update app res: %o", updateAppRes);
    showProgress(false);

    let updateAppResSigned = await signTx(updateAppRes.to_sign);
    console.log("updateAppResSigned: " + JSON.stringify(updateAppResSigned));

    showProgress(true);
    let submitUpdateAppRes = await bridge_submit_update_app({
      tx: updateAppResSigned,
    });
    console.log("submitUpdateAppRes: " + JSON.stringify(submitUpdateAppRes));

    showProgress(false);
    statusMsg.success("App updated!");
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateDaoData = async (statusMsg, showProgress, data) => {
  try {
    const { bridge_update_data, bridge_submit_update_dao_data } =
      await wasmPromise;

    showProgress(true);
    let updateDataRes = await bridge_update_data(data);
    console.log("Update DAO data res: %o", updateDataRes);
    showProgress(false);

    let updateDataResSigned = await signTx(updateDataRes.to_sign);
    console.log("updateDataResSigned: " + JSON.stringify(updateDataResSigned));

    showProgress(true);
    let submitUpdateDaoDataRes = await bridge_submit_update_dao_data({
      tx: updateDataResSigned,
    });
    console.log(
      "submitUpdateDaoDataRes: " + JSON.stringify(submitUpdateDaoDataRes)
    );

    statusMsg.success("Dao data updated!");
    showProgress(false);
  } catch (e) {
    statusMsg.error(e);
  }
};
