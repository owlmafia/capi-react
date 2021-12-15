import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (
  projectId,
  projectMaybe,
  setProject,
  setWithdrawalRequests,
  statusMsg
) => {
  try {
    const { init_log, bridge_load_withdrawals, bridge_load_project_user_view } =
      await wasmPromise;
    await init_log();

    // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
    var project = null;
    if (projectMaybe) {
      project = projectMaybe;
    } else {
      project = await bridge_load_project_user_view(projectId);
    }

    const withdrawalsRes = await bridge_load_withdrawals({
      project_id: project.id,
    });
    console.log("withdrawalsRes: " + JSON.stringify(withdrawalsRes));

    setProject(project);
    setWithdrawalRequests(withdrawalsRes.entries);
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
  withdrawalAmount,
  setWithdrawals,
  // TODO: don't pass - use setter parameter
  withdrawals,
  withdrawalDescr
) => {
  try {
    const { bridge_withdraw, bridge_submit_withdraw, bridge_balance } =
      await wasmPromise;
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

    // we just prepend the added request in js
    // can consider doing this in the server later to make sure list/page is up to date,
    // prob not worth it though, as there's only one person making requests at a time
    setWithdrawals([submitWithdrawRes.saved_withdrawal].concat(withdrawals));

    statusMsg.success("Withdrawal request submitted");
    showProgress(false);

    const balance = await bridge_balance({ address: myAddress });
    setMyBalance(balance.balance);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
