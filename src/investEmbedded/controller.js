import { toErrorMsg } from "../validation";

// Note: no locking for the embedded view because there's no design yet

const wasmPromise = import("wasm");

export const updateTotalPriceAndPercentage = async (
  deps,
  shareCount,
  dao,
  setBuySharesTotalPrice,
  setBuySharesTotalPriceNumber,
  setProfitPercentage,
  lockedShares
) => {
  try {
    const { bridge_calculate_shares_price } = await wasmPromise;

    let res = await bridge_calculate_shares_price({
      shares_amount: shareCount,
      available_shares: deps.availableSharesNumber,
      share_supply: dao.share_supply_number,
      investors_share: dao.investors_share,
      share_price: dao.share_price_number_algo,
      locked_shares: lockedShares,
    });

    console.log("res: %o", res);

    setBuySharesTotalPrice(res.total_price);
    setBuySharesTotalPriceNumber(res.total_price_number);
    setProfitPercentage(res.profit_percentage);
  } catch (e) {
    // for now disabled - we don't want to show validation messages while typing, to be consistent with other inputs
    // deps.statusMsg.error(e);
    console.error("updateTotalPriceAndPercentage error (ignored): %o", e);
  }
};

export const invest = async (
  deps,
  showProgress,
  daoId,
  dao,
  availableSharesNumber,
  buySharesCount,
  setShareAmountError,
  setShowBuyCurrencyInfoModal,
  totalCostNumber
) => {
  try {
    const {
      bridge_opt_in_to_apps_if_needed,
      bridge_buy_shares,
      bridge_submit_buy_shares,
    } = await wasmPromise;

    deps.statusMsg.clear();
    setShareAmountError(null);

    ///////////////////////////////////
    // TODO refactor invest/lock
    // 1. sign tx for app opt-in
    showProgress(true);
    let optInToAppsRes = await bridge_opt_in_to_apps_if_needed({
      app_id: "" + dao.app_id,
      investor_address: deps.myAddress,
    });
    console.log("optInToAppsRes: " + JSON.stringify(optInToAppsRes));
    var optInToAppsSignedOptional = null;
    if (optInToAppsRes.to_sign != null) {
      showProgress(false);
      optInToAppsSignedOptional = await deps.wallet.signTxs(
        optInToAppsRes.to_sign
      );
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
      available_shares: availableSharesNumber,
      investor_address: deps.myAddress,
      app_opt_ins: optInToAppsSignedOptional,
      signed_prospectus: dao.prospectus,
    });
    console.log("buyRes: " + JSON.stringify(buyRes));
    showProgress(false);

    let buySharesSigned = await deps.wallet.signTxs(buyRes.to_sign);
    console.log("buySharesSigned: " + JSON.stringify(buySharesSigned));

    showProgress(true);
    let submitBuySharesRes = await bridge_submit_buy_shares({
      investor_address: deps.myAddress,
      buy_total_cost: totalCostNumber,
      txs: buySharesSigned,
      pt: buyRes.pt,
    });
    console.log("submitBuySharesRes: " + JSON.stringify(submitBuySharesRes));
    showProgress(false);

    await deps.updateMyBalance(deps.myAddress);

    deps.statusMsg.success(
      "Congratulations! you bought " + buySharesCount + " shares."
    );

    await deps.updateMyShares(daoId, deps.myAddress);
    await deps.updateFunds(daoId);
    await deps.updateInvestmentData(daoId, deps.myAddress);
    await deps.updateAvailableShares(daoId);
    await deps.updateRaisedFunds(daoId);
    await deps.updateCompactFundsActivity(daoId);
    await deps.updateSharesDistr(dao);
  } catch (e) {
    if (e.type_identifier === "input_errors") {
      setShareAmountError(toErrorMsg(e.amount));
      // show a general message additionally, just in case
      deps.statusMsg.error("Please fix the errors");
    } else if (e.id === "not_enough_funds_asset") {
      setShowBuyCurrencyInfoModal({ amount: e.details });
    } else {
      deps.statusMsg.error(e);
    }
    showProgress(false);
  }
};
