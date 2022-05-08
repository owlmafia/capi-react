import { signTxs } from "../MyAlgo";

// Note: no locking for the embedded view because there's no design yet

const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const handleSharesCountInput = async (
  statusMsg,
  shareCountInput,
  dao,
  investmentData,
  setBuySharesCount,
  setBuySharesTotalPrice,
  setProfitPercentage
) => {
  try {
    const { bridge_calculate_shares_price } = await wasmPromise;

    // populate input
    setBuySharesCount(shareCountInput);

    if (shareCountInput === "") {
      setBuySharesTotalPrice(investmentData.init_share_price);
      setProfitPercentage(investmentData.init_profit_percentage);
    } else {
      let res = await bridge_calculate_shares_price({
        shares_amount: shareCountInput,
        available_shares: investmentData.available_shares,
        share_supply: dao.share_supply,
        investors_share: dao.investors_share,
        share_price: dao.share_price,
        share_specs_msg_pack: investmentData.share_specs_msg_pack,
      });

      console.log("res: %o", res);

      setBuySharesTotalPrice(res.total_price);
      setProfitPercentage(res.profit_percentage);
    }
  } catch (e) {
    statusMsg.error(e);
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
