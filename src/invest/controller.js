import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (
  projectId,
  myAddress,
  statusMsg,
  setProject,
  setInvestorCurrentSharesCount
) => {
  try {
    const {
      init_log,
      bridge_load_project_user_view,
      bridge_get_user_shares_count,
    } = await wasmPromise;

    await init_log();

    let project = await bridge_load_project_user_view(projectId);
    setProject(project);

    if (myAddress) {
      let owned_share_count = await bridge_get_user_shares_count({
        address: myAddress,
        shares_asset_id: project.share_asset_id,
      });
      console.log("Not staked shares: " + owned_share_count);
      setInvestorCurrentSharesCount(owned_share_count);
    }
  } catch (e) {
    statusMsg.error(e);
  }
};

export const invest = async (
  myAddress,
  showProgress,
  statusMsg,
  showModal,
  history,
  projectId,
  project,
  buySharesCount
) => {
  try {
    const {
      bridge_opt_in_to_apps_if_needed,
      bridge_buy_shares,
      bridge_submit_buy_shares,
    } = await wasmPromise;
    ///////////////////////////////////
    // TODO refactor invest/stake
    // 1. sign tx for app opt-in
    showProgress(true);
    let optInToAppsRes = await bridge_opt_in_to_apps_if_needed({
      app_id: "" + project.central_app_id,
      slot_ids: project.slot_ids,
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

    showModal({
      title: "Congratulations!",
      body: (
        <p>
          <span>{"You've become an investor of "}</span>
          <b> {project.name}</b>
          <span>{". "}</span>
          <button
            onClick={(_) => {
              history.push({
                pathname: "/investment/" + projectId,
                // TODO ensure project is set when calling this?
                state: project,
              });
              showModal(null);
            }}
          >
            {"Go to your investor site"}
          </button>
        </p>
      ),
    });
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const stake = async (
  myAddress,
  showProgress,
  statusMsg,
  showModal,
  setProject,
  history,
  projectId,
  project
) => {
  try {
    const {
      bridge_stake,
      bridge_submit_stake,
      bridge_load_project_user_view,
      bridge_opt_in_to_apps_if_needed,
    } = await wasmPromise;

    ///////////////////////////////////
    // TODO refactor invest/stake
    // 1. sign tx for app opt-in
    showProgress(true);
    let optInToAppRes = await bridge_opt_in_to_apps_if_needed({
      app_id: "" + project.central_app_id,
      slot_ids: project.slot_ids,
      investor_address: myAddress,
    });
    console.log("optInToAppRes: " + JSON.stringify(optInToAppRes));

    var optInToAppsSignedOptional = null;
    if (optInToAppRes.to_sign != null) {
      showProgress(false);
      optInToAppsSignedOptional = await signTxs(optInToAppRes.to_sign);
    }
    console.log(
      "optInToAppsSignedOptional: " + JSON.stringify(optInToAppsSignedOptional)
    );
    ///////////////////////////////////

    // 2. stake
    showProgress(true);
    let stakeRes = await bridge_stake({
      project_id: projectId,
      investor_address: myAddress,
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

    setProject(await bridge_load_project_user_view(projectId));

    statusMsg.success("Shares staked");
    showProgress(false);

    showModal({
      title: "Success",
      body: (
        <p>
          <span>{"Your shares are staked."}</span>
          <button
            onClick={(_) => {
              history.push({
                pathname: "/investment/" + projectId,
                // TODO ensure project is set when calling this?
                state: project,
              });
              showModal(null);
            }}
          >
            {"Go to your investor site"}
          </button>
        </p>
      ),
    });
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
