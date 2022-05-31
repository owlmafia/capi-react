import { signTxs } from "../MyAlgo";
import { toErrorMsg } from "../validation";

const wasmPromise = import("wasm");

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
  sharesForInvestors,
  imageBytes,
  socialMediaUrl,
  minRaiseTarget,
  minRaiseTargetEndDate,

  navigate,

  setDaoNameError,
  setDaoDescrError,
  setShareCountError,
  setSharePriceError,
  setInvestorsShareError,
  setSharesForInvestorsError,
  setLogoUrlError,
  setSocialMediaUrlError,
  setMinRaiseTargetError,
  setMinRaiseTargetEndDateError
) => {
  const {
    bridge_create_dao_assets_txs,
    bridge_create_dao,
    bridge_submit_create_dao,
  } = await wasmPromise;

  statusMsg.clear();
  showProgress(true);

  const ib = await imageBytes;
  const typedArray = new Uint8Array(ib);
  const bytes = [...typedArray];

  try {
    let createDaoAssetsRes = await bridge_create_dao_assets_txs({
      inputs: {
        creator: myAddress,
        dao_name: daoName,
        dao_description: daoDescr,
        share_count: shareCount,
        share_price: sharePrice,
        investors_share: investorsShare,
        shares_for_investors: sharesForInvestors,
        compressed_image: bytes,
        social_media_url: socialMediaUrl,
        min_raise_target: minRaiseTarget,
        min_raise_target_end_date: minRaiseTargetEndDate,
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

    navigate(submitDaoRes.dao.dao_link);

    showProgress(false);
    statusMsg.success("Project created!");

    await updateMyBalance(myAddress);
  } catch (e) {
    if (e.type_identifier === "input_errors") {
      setDaoNameError(toErrorMsg(e.name));
      setDaoDescrError(toErrorMsg(e.description));
      setShareCountError(toErrorMsg(e.share_supply));
      setSharePriceError(toErrorMsg(e.share_price));
      setInvestorsShareError(toErrorMsg(e.investors_share));
      setSharesForInvestorsError(toErrorMsg(e.shares_for_investors));
      setLogoUrlError(toErrorMsg(e.logo_url));
      setSocialMediaUrlError(toErrorMsg(e.social_media_url));
      setMinRaiseTargetError(toErrorMsg(e.min_raise_target));
      setMinRaiseTargetEndDateError(toErrorMsg(e.min_raise_target_end_date));

      // show a general message additionally, just in case
      statusMsg.error("Please fix the errors");
    } else {
      statusMsg.error(e);
    }

    showProgress(false);
  }
};
