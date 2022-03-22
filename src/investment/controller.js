import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (
  daoId,
  myAddress,
  statusMsg,
  setDao,
  updateInvestmentData,
  updateMyShares
) => {
  try {
    const { init_log, bridge_load_dao_user_view, bridge_load_investment } =
      await wasmPromise;
    await init_log();

    let dao = await bridge_load_dao_user_view(daoId);
    console.log("dao: " + JSON.stringify(dao));
    setDao(dao);

    if (myAddress) {
      // TODO check for daoId? or do we know it's always set?
      await updateInvestmentData();
      await updateMyShares(daoId, myAddress);
    }
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateChainInvestmentData_ = async (
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
  dao,
  amount,
  updateInvestmentData
) => {
  try {
    const { bridge_claim, bridge_submit_claim, bridge_load_investment } =
      await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let claimRes = await bridge_claim({
      dao_id: daoId,
      amount: amount,
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

    statusMsg.success("Profits retrieved");
    showProgress(false);

    await updateMyBalance(myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const unlock = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  updateMyShares,
  daoId,
  dao,
  updateInvestmentData
) => {
  try {
    const { bridge_unlock, bridge_submit_unlock, bridge_load_investment } =
      await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let unlockRes = await bridge_unlock({
      dao_id: daoId,
      investor_address: myAddress,
    });
    console.log("unlockRes: " + JSON.stringify(unlockRes));
    showProgress(false);

    let unlockResSigned = await signTxs(unlockRes.to_sign);
    console.log("unlockResSigned: " + JSON.stringify(unlockResSigned));

    showProgress(true);
    let submitUnlockRes = await bridge_submit_unlock({
      txs: unlockResSigned,
      pt: unlockRes.pt,
    });
    console.log("submitUnlockRes: " + JSON.stringify(submitUnlockRes));

    await updateInvestmentData();

    statusMsg.success("Shares unlocked");
    showProgress(false);

    await updateMyBalance(myAddress);
    await updateMyShares(daoId, myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
