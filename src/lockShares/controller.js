// Note: no locking for the embedded view because there's no design yet

import { toErrorMsg } from "../validation";

const wasmPromise = import("wasm");

export const lock = async (
  deps,
  showProgress,
  daoId,
  dao,
  lockSharesCount,
  onLockOpt,
  setInputError
) => {
  try {
    const { bridge_opt_in_to_apps_if_needed, bridge_lock, bridge_submit_lock } =
      await wasmPromise;
    deps.statusMsg.clear();
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

    let lockRes = await bridge_lock({
      dao_id: daoId,
      investor_address: deps.myAddress,
      share_count: lockSharesCount,
    });
    console.log("lockRes: " + JSON.stringify(lockRes));
    showProgress(false);

    let lockResSigned = await deps.wallet.signTxs(lockRes.to_sign);
    console.log("lockResSigned: " + JSON.stringify(lockResSigned));

    showProgress(true);

    let submitLockRes = await bridge_submit_lock({
      app_opt_ins: optInToAppsSignedOptional,
      txs: lockResSigned,
    });
    console.log("submitLockRes: " + JSON.stringify(submitLockRes));
    showProgress(false);

    deps.statusMsg.success(
      "Congratulations! you locked " + lockSharesCount + " shares."
    );

    await deps.updateInvestmentData(daoId, deps.myAddress);
    await deps.updateMyBalance(deps.myAddress);
    await deps.updateMyShares(daoId, deps.myAddress);

    if (onLockOpt) {
      onLockOpt();
    }
  } catch (e) {
    if (e.id === "validation") {
      console.error("%o", e);
      setInputError(toErrorMsg(e.details));
    } else {
      deps.statusMsg.error(e);
    }
    showProgress(false);
  }
};
