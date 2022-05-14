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
    const { bridge_load_dao_user_view } = await wasmPromise;

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
    const { bridge_unlock, bridge_submit_unlock } = await wasmPromise;
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

    statusMsg.success("Shares unlocked");
    showProgress(false);

    await updateInvestmentData();
    await updateMyBalance(myAddress);
    await updateMyShares(daoId, myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const invest = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  daoId,
  dao,
  buySharesCount,
  updateMyShares,
  updateFunds
) => {
  try {
    const {
      bridge_opt_in_to_apps_if_needed,
      bridge_buy_shares,
      bridge_submit_buy_shares,
    } = await wasmPromise;
    statusMsg.clear();
    ///////////////////////////////////
    // TODO refactor invest/lock
    // 1. sign tx for app opt-in
    showProgress(true);
    let optInToAppsRes = await bridge_opt_in_to_apps_if_needed({
      app_id: "" + dao.app_id,
      investor_address: myAddress,
    });
    console.log("optInToAppsRes: " + JSON.stringify(optInToAppsRes));
    var optInToAppsSignedOptional = null;
    if (optInToAppsRes.to_sign != null) {
      showProgress(false);
      optInToAppsSignedOptional = await signTxs(optInToAppsRes.to_sign);
    }
    console.log(
      "optInToAppsSignedOptional: " + JSON.stringify(optInToAppsSignedOptional)
    );
    ///////////////////////////////////

    showProgress(true);
    // 2. buy the shares (requires app opt-in for local state)
    // TODO write which local state
    let buyRes = await bridge_buy_shares({
      dao_id: daoId,
      share_count: buySharesCount,
      investor_address: myAddress,
      app_opt_ins: optInToAppsSignedOptional,
    });
    console.log("buyRes: " + JSON.stringify(buyRes));
    showProgress(false);

    let buySharesSigned = await signTxs(buyRes.to_sign);
    console.log("buySharesSigned: " + JSON.stringify(buySharesSigned));

    showProgress(true);
    let submitBuySharesRes = await bridge_submit_buy_shares({
      txs: buySharesSigned,
      pt: buyRes.pt,
    });
    console.log("submitBuySharesRes: " + JSON.stringify(submitBuySharesRes));
    showProgress(false);

    await updateMyBalance(myAddress);

    statusMsg.success(
      "Congratulations! you bought " + buySharesCount + " shares."
    );

    await updateMyShares(daoId, myAddress);
    await updateFunds(daoId);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
