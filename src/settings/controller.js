import { toBytes, toBytesForRust } from "../common_functions/common";
import { toMaybeIpfsUrl } from "../ipfs/store";
import { toErrorMsg } from "../validation";

const wasmPromise = import("wasm");

export const prefillInputs = async (
  deps,
  daoId,
  setDaoName,
  setDaoDescr,
  setSharePrice,
  setImageBytes,
  setSocialMediaUrl,
  setMinInvestShares,
  setMaxInvestShares,
  setProspectus
) => {
  try {
    const { bridge_updatable_data } = await wasmPromise;

    // prefill dao inputs
    let updatableData = await bridge_updatable_data({ dao_id: daoId });
    setDaoName(updatableData.project_name);
    setDaoDescr(updatableData.project_desc);
    setSharePrice(updatableData.share_price);
    // TODO header may not be needed - test without once everything else works, remove if not needed
    setImageBytes("data:image/png;base64," + updatableData.image_base64);
    setSocialMediaUrl(updatableData.social_media_url);
    setMinInvestShares(updatableData.min_invest_amount);
    setMaxInvestShares(updatableData.max_invest_amount);
    setProspectus(updatableData.prospectus);
  } catch (e) {
    deps.statusMsg.error(e);
  }
};

export const updateApp = async (
  deps,
  showProgress,
  daoId,
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
      owner: deps.myAddress,
      approval_version: approvalVersion,
      clear_version: clearVersion,
    });
    console.log("Update app res: %o", updateAppRes);
    showProgress(false);

    let updateAppResSigned = await deps.wallet.signTxs(updateAppRes.to_sign);
    console.log("updateAppResSigned: " + JSON.stringify(updateAppResSigned));

    showProgress(true);
    let submitUpdateAppRes = await bridge_submit_update_app({
      txs: updateAppResSigned,
    });
    console.log("submitUpdateAppRes: " + JSON.stringify(submitUpdateAppRes));

    // re-fetch version data to update things that depend on "there's a new version" (e.g. settings badge)
    updateVersion(daoId);

    showProgress(false);
    deps.statusMsg.success("App updated!");
  } catch (e) {
    deps.statusMsg.error(e);
  }
};

export const updateDaoData = async (
  deps,
  showProgress,
  daoId,
  projectName,
  daoDescr,
  sharePrice,
  imageBytes,
  socialMediaUrl,
  prospectusBytes,
  minInvestShares,
  maxInvestShares,

  setDaoNameError,
  setDaoDescrError,
  setImageError,
  setProspectusError,
  setSocialMediaUrlError,
  setMinInvestSharesError,
  setMaxInvestSharesError
) => {
  try {
    const { bridge_update_data, bridge_submit_update_dao_data } =
      await wasmPromise;

    showProgress(true);

    const imageUrl = await toMaybeIpfsUrl(await imageBytes);
    const descrUrl = await toMaybeIpfsUrl(toBytes(await daoDescr));

    const prospectusBytesResolved = await prospectusBytes;
    const prospectusUrl = await toMaybeIpfsUrl(prospectusBytesResolved);
    const prospectusBytesForRust = toBytesForRust(prospectusBytesResolved);

    let updateDataRes = await bridge_update_data({
      dao_id: daoId,

      project_name: projectName,
      project_desc_url: descrUrl,
      share_price: sharePrice,

      owner: deps.myAddress,

      image_url: imageUrl,
      social_media_url: socialMediaUrl,

      prospectus_url: prospectusUrl,
      prospectus_bytes: prospectusBytesForRust,
      min_invest_amount: minInvestShares,
      max_invest_amount: maxInvestShares,
    });
    console.log("Update DAO data res: %o", updateDataRes);
    showProgress(false);

    let updateDataResSigned = await deps.wallet.signTxs(updateDataRes.to_sign);
    console.log("updateDataResSigned: " + JSON.stringify(updateDataResSigned));

    showProgress(true);
    let submitUpdateDaoDataRes = await bridge_submit_update_dao_data({
      txs: updateDataResSigned,
      pt: updateDataRes.pt, // passthrough
    });
    console.log(
      "submitUpdateDaoDataRes: " + JSON.stringify(submitUpdateDaoDataRes)
    );

    await deps.updateDao(daoId);

    deps.statusMsg.success("Dao data updated!");

    showProgress(false);
  } catch (e) {
    if (e.id === "validations") {
      let details = e.details;
      setDaoNameError(toErrorMsg(details.name));
      setDaoDescrError(toErrorMsg(details.description));
      setImageError(toErrorMsg(details.image));
      setProspectusError(toErrorMsg(details.prospectus));
      setSocialMediaUrlError(toErrorMsg(details.social_media_url));
      setMinInvestSharesError(toErrorMsg(details.min_invest_shares));
      setMaxInvestSharesError(toErrorMsg(details.max_invest_shares));

      deps.statusMsg.error("Please fix the errors");
    } else {
      deps.statusMsg.error(e);
    }
    showProgress(false);
  }
};

export const rekeyOwner = async (
  deps,
  showProgress,
  daoId,
  authAddress,
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

    let rekeySigned = await deps.wallet.signTxs(rekeyRes.to_sign);
    console.log("rekeySigned: " + JSON.stringify(rekeySigned));

    showProgress(true);
    let submitRekeyRes = await bridge_submit_rekey_owner({
      txs: rekeySigned,
    });
    console.log("submitRekeyRes: " + JSON.stringify(submitRekeyRes));

    deps.statusMsg.success(
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
      deps.statusMsg.error(e);
    }
    showProgress(false);
  }
};
