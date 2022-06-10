import { toErrorMsg } from "../validation";

// Note: no locking for the embedded view because there's no design yet

const wasmPromise = import("wasm");

export const fetchAvailableShares = async (
  statusMsg,
  daoId,
  setAvailableShares
) => {
  try {
    const { bridge_load_available_shares } = await wasmPromise;
    let res = await bridge_load_available_shares({
      dao_id: daoId,
    });
    setAvailableShares(res.available_shares);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateTotalPriceAndPercentage = async (
  statusMsg,
  shareCountInput,
  dao,
  availableShares,
  setBuySharesTotalPrice,
  setBuySharesTotalPriceNumber,
  setProfitPercentage
) => {
  try {
    const { bridge_calculate_shares_price } = await wasmPromise;

    // UX - if user empties the field, we want to continue showing price / percentage for 1 share
    const shareCount = shareCountInput === "" ? "1" : shareCountInput;

    let res = await bridge_calculate_shares_price({
      shares_amount: shareCount,
      available_shares: availableShares,
      share_supply: dao.share_supply_number,
      investors_share: dao.investors_share,
      share_price: dao.share_price_number_algo,
    });

    console.log("res: %o", res);

    setBuySharesTotalPrice(res.total_price);
    setBuySharesTotalPriceNumber(res.total_price_number);
    setProfitPercentage(res.profit_percentage);
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
  updateFunds,
  setShareAmountError,
  wallet,
  setShowBuyCurrencyInfoModal,
  totalCostNumber
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
      optInToAppsSignedOptional = await wallet.signTxs(optInToAppsRes.to_sign);
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

    let buySharesSigned = await wallet.signTxs(buyRes.to_sign);
    console.log("buySharesSigned: " + JSON.stringify(buySharesSigned));

    showProgress(true);
    let submitBuySharesRes = await bridge_submit_buy_shares({
      investor_address: myAddress,
      buy_total_cost: totalCostNumber,
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
    if (e.type_identifier === "input_errors") {
      setShareAmountError(toErrorMsg(e.amount));
      // show a general message additionally, just in case
      statusMsg.error("Please fix the errors");
    } else if (e.id === "not_enough_funds_asset") {
      setShowBuyCurrencyInfoModal({ amount: e.details });
    } else {
      statusMsg.error(e);
    }
    showProgress(false);
  }
};
