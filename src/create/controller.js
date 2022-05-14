import { signTxs } from "../MyAlgo";

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
  navigate,

  setDaoNameError,
  setDaoDescrError,
  setShareCountError,
  setSharePriceError,
  setInvestorsShareError,
  setSharesForInvestorsError,
  setLogoUrlError,
  setSocialMediaUrlError
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

      // show a general message additionally, just in case
      statusMsg.error("Please fix the errors");
    } else {
      statusMsg.error(e);
    }

    showProgress(false);
  }
};

/// field-specific error -> error message
const toErrorMsg = (e) => {
  // if the field-specific error is null, there's no error so there's no error message
  if (!e) {
    return null;
  }

  switch (e.type_) {
    case "empty":
      return "Please enter something";
    case "min_length":
      return (
        "Must have at least " +
        e.min_length.min +
        " characters. Current: " +
        e.min_length.actual
      );
    case "max_length":
      return (
        "Must have less than " +
        e.max_length.max +
        " characters. Current: " +
        e.max_length.actual
      );
    case "min":
      return "Must be greater than " + e.min.min;
    case "max":
      return "Must be less than " + e.max.max;
    case "address":
      return "Invalid address format";
    case "not_int":
      return "Invalid (whole) number format";
    case "not_dec":
      return "Invalid number format";
    case "max_fractionals":
      return (
        "Must have less than " +
        e.max_fractionals.max +
        " fractional digits. Current: " +
        e.max_fractionals.actual
      );
    case "unexpected":
      return "Unexpected problem: " + e.unexpected;
    default:
      return "";
  }
};
