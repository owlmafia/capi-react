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
  updateInvestmentData
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

    await updateInvestmentData();

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
