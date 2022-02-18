import { signTxs } from "../MyAlgo";

// Note: no locking for the embedded view because there's no design yet

const wasmPromise = import("wasm");

export const lock = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  projectId,
  project,
  lockSharesCount,
  updateMyShares
) => {
  try {
    const {
      bridge_opt_in_to_apps_if_needed,
      bridge_lock,
      bridge_submit_lock,
      bridge_balance,
    } = await wasmPromise;
    statusMsg.clear();
    ///////////////////////////////////
    // TODO refactor invest/lock
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

    let lockRes = await bridge_lock({
      project_id: projectId,
      investor_address: myAddress,
      share_count: lockSharesCount,
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

    updateMyShares(projectId, myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
