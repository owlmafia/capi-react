import { signTx } from "../MyAlgo";

const wasmPromise = import("wasm");

export const prefillInputs = async (
  statusMsg,
  daoId,
  setDaoName,
  setDaoDescr,
  setSharePrice,
  setImageBytes,
  setSocialMediaUrl,
  setCustomerEscrow,
  setCustomerEscrowVersion,
  setOwner
) => {
  try {
    const { bridge_updatable_data } = await wasmPromise;

    // prefill dao inputs
    let updatableData = await bridge_updatable_data({ dao_id: daoId });
    setDaoName(updatableData.project_name);
    setDaoDescr(updatableData.project_desc);
    setSharePrice(updatableData.share_price);
    // TODO header may not be needed - test without once everything else works, remove if not needed
    setImageBytes("data:image/png;base64," + updatableData.image_bytes);
    setSocialMediaUrl(updatableData.social_media_url);
    setCustomerEscrow(updatableData.customer_escrow);
    setCustomerEscrowVersion(updatableData.customer_escrow_version);
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
  clearVersion,
  updateVersion
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

    // re-fetch version data to update things that depend on "there's a new version" (e.g. settings badge)
    updateVersion(daoId);

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
      pt: updateDataRes.pt, // passthrough
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
