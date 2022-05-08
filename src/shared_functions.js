import { signTxs } from "./MyAlgo";

const wasmPromise = import("wasm");

export const updateInvestmentData_ = async (
  statusMsg,
  myAddress,
  daoId,
  setChainInvestmentData
) => {
  try {
    const { bridge_load_investment } = await wasmPromise;

    if (myAddress) {
      let data = await bridge_load_investment({
        dao_id: daoId,
        investor_address: myAddress,
      });
      console.log("Investment data: %o", data);
      setChainInvestmentData(data);
    }
  } catch (e) {
    statusMsg.error(e);
  }
};

export const retrieveProfits = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  daoId,
  updateInvestmentData,
  updateFunds
) => {
  try {
    const { bridge_claim, bridge_submit_claim } = await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let claimRes = await bridge_claim({
      dao_id: daoId,
      investor_address: myAddress,
    });
    console.log("claimRes: " + JSON.stringify(claimRes));
    showProgress(false);

    let claimResSigned = await signTxs(claimRes.to_sign);
    console.log("claimResSigned: " + JSON.stringify(claimResSigned));

    showProgress(true);
    let submitClaimRes = await bridge_submit_claim({
      investor_address_for_diagnostics: myAddress,
      dao_id_for_diagnostics: daoId,

      txs: claimResSigned,
      pt: claimRes.pt,
    });
    console.log("submitClaimRes: " + JSON.stringify(submitClaimRes));

    await updateInvestmentData(daoId, myAddress);
    await updateFunds(daoId);

    statusMsg.success("Dividend claimed");
    showProgress(false);

    await updateMyBalance(myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const shortedAddress = (address) => {
  const short_chars = 3;
  const leading = address.substring(0, short_chars);
  const trailing = address.substring(address.length - short_chars);
  return leading + "..." + trailing;
};

export const updateFunds_ = async (daoId, setFunds, statusMsg) => {
  /// We don't have a function in WASM yet to fetch only the funds so we re-fetch the dao.
  /// TODO: optimize: fetch only the funds (probably pass escrows/dao as inputs), so request is quicker.
  try {
    const { bridge_view_dao } = await wasmPromise;
    let viewDao = await bridge_view_dao({
      dao_id: daoId,
    });
    // setViewDao(viewDao);
    // these are overwritten when draining, so we keep them separate
    // TODO drain here? is this comment up to date?
    setFunds(viewDao.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};
