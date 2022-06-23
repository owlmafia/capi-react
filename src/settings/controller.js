import { toErrorMsg } from "../validation";

const wasmPromise = import("wasm");

export const prefillInputs = async (
  statusMsg,
  daoId,
  setDaoName,
  setDaoDescr,
  setSharePrice,
  setImageBytes,
  setSocialMediaUrl
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
  updateVersion,
  wallet
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

    let updateAppResSigned = await wallet.signTxs(updateAppRes.to_sign);
    console.log("updateAppResSigned: " + JSON.stringify(updateAppResSigned));

    showProgress(true);
    let submitUpdateAppRes = await bridge_submit_update_app({
      txs: updateAppResSigned,
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

export const updateDaoData = async (
  statusMsg,
  showProgress,
  data,
  wallet,
  setDaoNameError,
  setDaoDescrError,
  setImageError,
  setSocialMediaUrlError
) => {
  try {
    const { bridge_update_data, bridge_submit_update_dao_data } =
      await wasmPromise;

    showProgress(true);
    let updateDataRes = await bridge_update_data(data);
    console.log("Update DAO data res: %o", updateDataRes);
    showProgress(false);

    let updateDataResSigned = await wallet.signTxs(updateDataRes.to_sign);
    console.log("updateDataResSigned: " + JSON.stringify(updateDataResSigned));

    showProgress(true);
    let submitUpdateDaoDataRes = await bridge_submit_update_dao_data({
      txs: updateDataResSigned,
      pt: updateDataRes.pt, // passthrough
    });
    console.log(
      "submitUpdateDaoDataRes: " + JSON.stringify(submitUpdateDaoDataRes)
    );

    statusMsg.success("Dao data updated!");
    showProgress(false);
  } catch (e) {
    if (e.id === "validations") {
      let details = e.details;
      setDaoNameError(toErrorMsg(details.name));
      setDaoDescrError(toErrorMsg(details.description));
      setImageError(toErrorMsg(details.image));
      setSocialMediaUrlError(toErrorMsg(details.social_media_url));

      statusMsg.error("Please fix the errors");
    } else {
      statusMsg.error(e);
    }
    showProgress(false);
  }
};

export const rekeyOwner = async (
  statusMsg,
  showProgress,
  daoId,
  authAddress,
  wallet,
  setInputError
) => {
  try {
    const { bridge_rekey_owner, bridge_submit_rekey_owner } = await wasmPromise;

    showProgress(true);
    let rekeyRes = await bridge_rekey_owner({
      dao_id: daoId,
      auth_address: authAddress,
    });
    console.log("rekeyRes: %o", rekeyRes);
    showProgress(false);

    let rekeySigned = await wallet.signTxs(rekeyRes.to_sign);
    console.log("rekeySigned: " + JSON.stringify(rekeySigned));

    showProgress(true);
    let submitRekeyRes = await bridge_submit_rekey_owner({
      txs: rekeySigned,
    });
    console.log("submitRekeyRes: " + JSON.stringify(submitRekeyRes));

    statusMsg.success(
      "Owner rekeyed to: " +
        authAddress +
        ". Please login with this account to be able to sign transactions."
    );
    showProgress(false);
  } catch (e) {
    if (e.id === "validation") {
      console.error("%o", e);
      setInputError(toErrorMsg(e.details));
    } else {
      statusMsg.error(e);
    }
    showProgress(false);
  }
};
