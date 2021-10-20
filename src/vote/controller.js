import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (
  projectId,
  myAddress,
  setProject,
  setWithdrawalRequests,
  setChainInvestmentData
) => {
  const {
    init_log,
    bridge_load_withdrawal_requests,
    bridge_load_project_user_view,
    bridge_load_investment,
  } = await wasmPromise;
  await init_log();

  // TODO (later) in parallel (e.g. get project, withdrawal reqs)? parallelize in rust? or here?

  let project = await bridge_load_project_user_view(projectId);
  console.log("project: " + JSON.stringify(project));
  setProject(project);

  const withdrawalRequestsRes = await bridge_load_withdrawal_requests({
    project_id: projectId,
  });
  console.log(
    "withdrawalRequestsRes: " + JSON.stringify(withdrawalRequestsRes)
  );
  setWithdrawalRequests(withdrawalRequestsRes.requests);

  if (myAddress) {
    console.log("myAddress: " + myAddress);
    let investorData = await bridge_load_investment({
      project_id: projectId,
      app_id: project.central_app_id,
      shares_asset_id: project.share_asset_id,
      investor_address: myAddress,
    });
    console.log("investorData: " + JSON.stringify(investorData));
    setChainInvestmentData(investorData);
  }
};

export const vote = async (
  myAddress,
  showProgress,
  statusMsg,
  projectId,
  req
) => {
  try {
    const { bridge_vote, bridge_submit_vote } = await wasmPromise;

    showProgress(true);
    let voteRes = await bridge_vote({
      project_id: projectId,
      slot_id: req.slot_id,
      voter_address: myAddress,
    });
    // TODO update list with returned withdrawals list
    console.log("voteRes: " + JSON.stringify(voteRes));
    showProgress(false);

    let voteSigned = await signTxs(voteRes.to_sign);

    console.log("voteSigned: " + voteSigned);

    showProgress(true);
    let submitVoteRes = await bridge_submit_vote({
      project_id: projectId,
      slot_id: req.slot_id,
      txs: voteSigned,
      pt: voteRes.pt,
    });

    console.log("submitVoteRes: " + JSON.stringify(submitVoteRes));
    statusMsg.success("Voted!");
    showProgress(false);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
