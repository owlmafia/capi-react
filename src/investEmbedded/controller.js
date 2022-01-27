import { signTxs } from "../MyAlgo";

// Note: no staking for the embedded view because there's no design yet

const wasmPromise = import("wasm");

export const init = async (
  statusMsg,
  shareCountInput,
  project,
  setBuySharesTotalPrice
) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();

    updateTotalCost(shareCountInput, project, setBuySharesTotalPrice);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const handleSharesCountInput = async (
  shareCountInput,
  project,
  setBuySharesCount,
  setBuySharesTotalPrice
) => {
  setBuySharesCount(shareCountInput);
  updateTotalCost(shareCountInput, project, setBuySharesTotalPrice);
};

export const updateTotalCost = async (
  shareCountInput,
  project,
  setBuySharesTotalPrice
) => {
  // TODO (low prio) do calculation in WASM - JS only strictly presentation logic
  if (!isNaN(shareCountInput)) {
    const price = shareCountInput * project.share_price_number_algo;
    setBuySharesTotalPrice(price + " Algo");
  } else {
    setBuySharesTotalPrice("");
  }
};

export const invest = async (
  myAddress,
  showProgress,
  statusMsg,
  setMyBalance,
  projectId,
  project,
  buySharesCount
) => {
  try {
    const {
      bridge_opt_in_to_apps_if_needed,
      bridge_buy_shares,
      bridge_submit_buy_shares,
      bridge_balance,
    } = await wasmPromise;
    statusMsg.clear();
    ///////////////////////////////////
    // TODO refactor invest/stake
    // 1. sign tx for app opt-in
    showProgress(true);
    let optInToAppsRes = await bridge_opt_in_to_apps_if_needed({
      app_id: "" + project.central_app_id,
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
      project_id: projectId,
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

    const balance = await bridge_balance({ address: myAddress });
    setMyBalance(balance.balance);

    statusMsg.success(
      "Congratulations! you bought " + buySharesCount + " shares."
    );
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
