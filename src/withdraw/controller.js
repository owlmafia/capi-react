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
    const {
      init_log,
      bridge_load_withdrawal_requests,
      bridge_load_project_user_view,
    } = await wasmPromise;
    await init_log();

    // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
    var project = null;
    if (projectMaybe) {
      project = projectMaybe;
    } else {
      project = await bridge_load_project_user_view(projectId);
    }

    const withdrawalRequestsRes = await bridge_load_withdrawal_requests({
      project_id: project.id,
    });
    console.log(
      "withdrawalRequestsRes: " + JSON.stringify(withdrawalRequestsRes)
    );

    setProject(project);
    setWithdrawalRequests(withdrawalRequestsRes.requests);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const withdraw = async (
  myAddress,
  showProgress,
  statusMsg,
  projectId,
  req,
  setWithdrawalRequests
) => {
  try {
    const {
      bridge_withdraw,
      bridge_submit_withdrawal_request,
      bridge_load_withdrawal_requests,
    } = await wasmPromise;

    showProgress(true);
    let withdrawRes = await bridge_withdraw({
      project_id: projectId,
      sender: myAddress,
      withdrawal_amount: req.amount_not_formatted,
      slot_id: req.slot_id,
    });
    console.log("withdrawRes: " + JSON.stringify(withdrawRes));
    showProgress(false);

    let withdrawSigned = await signTxs(withdrawRes.to_sign);

    console.log("withdrawSigned: " + withdrawSigned);

    showProgress(true);
    let submitWithdrawalRes = await bridge_submit_withdrawal_request({
      request_id: req.request_id,
      txs: withdrawSigned,
      pt: withdrawRes.pt,
    });

    console.log("submitWithdrawalRes: " + JSON.stringify(submitWithdrawalRes));

    // reload withdrawal requests: to refresh completed status (UI)
    // TODO maybe frontend-only operation, especially when using indexer later to
    // determine this it will be slow most likely
    const withdrawalRequestsRes = await bridge_load_withdrawal_requests({
      project_id: projectId,
    });
    console.log(
      "withdrawalRequestsRes: " + JSON.stringify(withdrawalRequestsRes)
    );

    statusMsg.success("Withdrawal success");

    setWithdrawalRequests(withdrawalRequestsRes.requests);
    showProgress(false);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const addRequest = async (
  myAddress,
  showProgress,
  statusMsg,
  projectId,
  withdrawalAmount,
  setWithdrawalRequests,
  withdrawalRequests,
  withdrawalDescr
) => {
  try {
    const {
      bridge_init_withdrawal_request,
      bridge_submit_init_withdrawal_request,
    } = await wasmPromise;

    showProgress(true);
    let initWithdrawalRequestRes = await bridge_init_withdrawal_request({
      project_id: projectId,
      sender: myAddress,
      withdrawal_amount: withdrawalAmount,
    });
    // TODO update list with returned withdrawals list
    console.log(
      "initWithdrawalRequestRes: " + JSON.stringify(initWithdrawalRequestRes)
    );
    showProgress(false);

    let initWithdrawalRequestSigned = await signTxs(
      initWithdrawalRequestRes.to_sign
    );
    console.log("initWithdrawalRequestSigned: " + initWithdrawalRequestSigned);

    showProgress(true);
    let submitInitWithdrawalRequestRes =
      await bridge_submit_init_withdrawal_request({
        txs: initWithdrawalRequestSigned,
        pt: initWithdrawalRequestRes.pt,
        description: withdrawalDescr,
      });

    console.log(
      "submitInitWithdrawalRequestRes: " +
        JSON.stringify(submitInitWithdrawalRequestRes)
    );

    // we just prepend the added request in js
    // can consider doing this in the server later to make sure list/page is up to date,
    // prob not worth it though, as there's only one person making requests at a time
    setWithdrawalRequests(
      [submitInitWithdrawalRequestRes.saved_request].concat(withdrawalRequests)
    );

    statusMsg.success("Withdrawal request submitted");
    showProgress(false);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
