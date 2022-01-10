import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (
  projectUuid,
  projectMaybe,
  setProject,
  statusMsg
) => {
  try {
    const { init_log, bridge_load_project_user_view_with_uuid } =
      await wasmPromise;
    await init_log();

    // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
    var project = null;
    if (projectMaybe) {
      project = projectMaybe;
    } else {
      project = await bridge_load_project_user_view_with_uuid(projectUuid);
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
  setMyBalance,
  projectId,
  projectUuid,
  withdrawalAmount,
  withdrawalDescr
) => {
  try {
    const { bridge_withdraw, bridge_submit_withdraw, bridge_balance } =
      await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let withdrawRes = await bridge_withdraw({
      project_id: projectId,
      project_uuid: projectUuid,
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

    const balance = await bridge_balance({ address: myAddress });
    setMyBalance(balance.balance);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
