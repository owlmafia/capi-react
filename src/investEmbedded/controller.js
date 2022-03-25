import { signTxs } from "../MyAlgo";

// Note: no locking for the embedded view because there's no design yet

const wasmPromise = import("wasm");

export const init = async (
  statusMsg,
  shareCountInput,
  dao,
  setBuySharesTotalPrice
) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();

    updateTotalCost(shareCountInput, dao, setBuySharesTotalPrice);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const handleSharesCountInput = async (
  shareCountInput,
  dao,
  setBuySharesCount,
  setBuySharesTotalPrice
) => {
  setBuySharesCount(shareCountInput);
  updateTotalCost(shareCountInput, dao, setBuySharesTotalPrice);
};

export const updateTotalCost = async (
  shareCountInput,
  dao,
  setBuySharesTotalPrice
) => {
  // TODO (low prio) do calculation in WASM - JS only strictly presentation logic
  if (!isNaN(shareCountInput)) {
    const price = shareCountInput * dao.share_price_number_algo;
    setBuySharesTotalPrice(price);
  } else {
    setBuySharesTotalPrice("");
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
    await updateFunds();
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const lock = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  daoId,
  dao,
  lockSharesCount,
  updateMyShares
) => {
  try {
    const { bridge_opt_in_to_apps_if_needed, bridge_lock, bridge_submit_lock } =
      await wasmPromise;
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

    let lockRes = await bridge_lock({
      dao_id: daoId,
      investor_address: myAddress,
    });
    console.log("lockRes: " + JSON.stringify(lockRes));
    showProgress(false);

    let lockResSigned = await signTxs(lockRes.to_sign);
    console.log("lockResSigned: " + JSON.stringify(lockResSigned));

    showProgress(true);

    let submitLockRes = await bridge_submit_lock({
      app_opt_ins: optInToAppsSignedOptional,
      txs: lockResSigned,
    });
    console.log("submitLockRes: " + JSON.stringify(submitLockRes));
    showProgress(false);

    await updateMyBalance(myAddress);

    statusMsg.success(
      "Congratulations! you locked " + lockSharesCount + " shares."
    );

    updateMyShares(daoId, myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
