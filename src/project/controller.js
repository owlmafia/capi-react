import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (
  projectId,
  setViewProject,
  setFunds,
  setCustomerBalance
) => {
  const { init_log, bridge_view_project } = await wasmPromise;
  await init_log();
  let project = await bridge_view_project({
    project_id: projectId,
  });
  setViewProject(project);
  // these are overwritten when draining, so we keep them separate
  setFunds(project.funds);
  setCustomerBalance(project.funds_to_drain);

  // return data for immediate consumption on the UI. TODO probably it's better to attach a listener to the hook or similar
  return project;
};

export const drain = async (
  myAddress,
  showProgress,
  statusMsg,
  projectId,
  setFunds,
  setCustomerBalance
) => {
  try {
    const { bridge_drain, bridge_submit_drain } = await wasmPromise;
    statusMsg.clear();

    showProgress(true);

    let drainRes = await bridge_drain({
      project_id: projectId,
      drainer_address: myAddress,
    });
    console.log("drainRes: " + JSON.stringify(drainRes));
    showProgress(false);

    let drainResSigned = await signTxs(drainRes.to_sign);
    console.log("drainResSigned: " + JSON.stringify(drainResSigned));

    showProgress(true);
    let submitDrainRes = await bridge_submit_drain({
      txs: drainResSigned,
      pt: drainRes.pt,
    });
    console.log("submitDrainRes: " + JSON.stringify(submitDrainRes));
    setFunds(submitDrainRes.new_central_escrow_balance);
    setCustomerBalance(submitDrainRes.new_customer_escrow_balance);
    statusMsg.success("Funds transferred");
    showProgress(false);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
