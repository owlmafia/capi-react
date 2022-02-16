import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (projectId, projectMaybe, setProject, statusMsg) => {
  try {
    const { init_log, bridge_load_project_user_view_with_id } =
      await wasmPromise;
    await init_log();

    // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
    var project = null;
    if (projectMaybe) {
      project = projectMaybe;
    } else {
      project = await bridge_load_project_user_view_with_id(projectId);
    }

    setProject(project);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const withdraw = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  projectId,
  withdrawalAmount,
  withdrawalDescr,
  updateFunds
) => {
  try {
    const { bridge_withdraw, bridge_submit_withdraw } = await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let withdrawRes = await bridge_withdraw({
      project_id: projectId,
      sender: myAddress,
      withdrawal_amount: withdrawalAmount,
      description: withdrawalDescr,
    });
    // TODO update list with returned withdrawals list
    console.log("withdrawRes: " + JSON.stringify(withdrawRes));
    showProgress(false);

    let withdrawResSigned = await signTxs(withdrawRes.to_sign);
    console.log("withdrawResSigned: " + withdrawResSigned);

    showProgress(true);
    let submitWithdrawRes = await bridge_submit_withdraw({
      txs: withdrawResSigned,
      pt: withdrawRes.pt,
    });

    console.log("submitWithdrawRes: " + JSON.stringify(submitWithdrawRes));

    statusMsg.success("Withdrawal request submitted");
    showProgress(false);

    await updateMyBalance(myAddress);
    await updateFunds();
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const updateProject = async (
  projectId,
  setViewProject,
  setFunds,
  statusMsg
) => {
  try {
    const { bridge_view_project } = await wasmPromise;
    let viewProject = await bridge_view_project({
      project_id: projectId,
    });
    // setViewProject(viewProject);
    // these are overwritten when draining, so we keep them separate
    // TODO drain here? is this comment up to date?
    setFunds(viewProject.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateFunds_ = async (
  projectId,
  setViewProject,
  setFunds,
  statusMsg
) => {
  /// We don't have a function in WASM yet to fetch only the funds so we re-fetch the project.
  /// TODO: optimize: fetch only the funds (probably pass escrows/project as inputs), so request is quicker.
  updateProject(projectId, setViewProject, setFunds, statusMsg);
};
