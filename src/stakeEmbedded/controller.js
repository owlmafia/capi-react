import { signTxs } from "../MyAlgo";

// Note: no staking for the embedded view because there's no design yet

const wasmPromise = import("wasm");

export const stake = async (
  myAddress,
  showProgress,
  statusMsg,
  setMyBalance,
  projectId,
  project,
  stakeSharesCount,
  updateMyShares
) => {
  try {
    const {
      bridge_opt_in_to_apps_if_needed,
      bridge_stake,
      bridge_submit_stake,
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

    let stakeRes = await bridge_stake({
      project_id: projectId,
      investor_address: myAddress,
      share_count: stakeSharesCount,
    });
    console.log("stakeRes: " + JSON.stringify(stakeRes));
    showProgress(false);

    let stakeResSigned = await signTxs(stakeRes.to_sign);
    console.log("stakeResSigned: " + JSON.stringify(stakeResSigned));

    showProgress(true);

    let submitStakeRes = await bridge_submit_stake({
      app_opt_ins: optInToAppsSignedOptional,
      txs: stakeResSigned,
    });
    console.log("submitStakeRes: " + JSON.stringify(submitStakeRes));
    showProgress(false);

    const balance = await bridge_balance({ address: myAddress });
    setMyBalance(balance.balance);

    statusMsg.success(
      "Congratulations! you staked " + stakeSharesCount + " shares."
    );

    updateMyShares(projectId, myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
