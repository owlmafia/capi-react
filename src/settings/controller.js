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

// TODO review (everywhere): we don't wait for init to finish (i.e. init the logs) to call functions like these
// this might lead to some logs not showing (if it's the first view we load in the app - otherwise we could be affected by log init from a previous view)
// and can't be added in init after initializing the logs, as it has dependencies (like params.id),
// which would mean that the logs are initialized multiple times (when the dependencies change)
export const checkForUpdates = async (statusMsg, daoId, setVersionData) => {
  try {
    const { bridge_check_for_updates } = await wasmPromise;
    let versionData = await bridge_check_for_updates({ dao_id: daoId });

    if (versionData) {
      setVersionData(versionData);
    }
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
  setCustomerEscrow,
  setInvestingEscrow,
  setLockingEscrow,
  setCustomerEscrowVersion,
  setInvestingEscrowVersion,
  setLockingEscrowVersion,
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
    setCustomerEscrow(updatableData.customer_escrow);
    setInvestingEscrow(updatableData.investing_escrow);
    setLockingEscrow(updatableData.locking_escrow);
    setCustomerEscrowVersion(updatableData.customer_escrow_version);
    setInvestingEscrowVersion(updatableData.investing_escrow_version);
    setLockingEscrowVersion(updatableData.locking_escrow_version);
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
