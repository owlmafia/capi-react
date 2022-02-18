import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (
  projectId,
  myAddress,
  statusMsg,
  setProject,
  setYouAreNotInvested,
  setChainInvestmentData
) => {
  try {
    const { init_log, bridge_load_project_user_view, bridge_load_investment } =
      await wasmPromise;
    await init_log();

    let project = await bridge_load_project_user_view(projectId);
    console.log("project: " + JSON.stringify(project));
    setProject(project);

    if (myAddress) {
      console.log("myAddress: " + myAddress);
      setChainInvestmentData(
        await bridge_load_investment({
          project_id: projectId,
          app_id: project.central_app_id,
          shares_asset_id: project.shares_asset_id,
          investor_address: myAddress,
        })
      );
    }
  } catch (e) {
    if (e === "You're not invested in this project.") {
      setYouAreNotInvested(true);
    } else {
      statusMsg.error(e);
    }
  }
};

export const retrieveProfits = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  projectId,
  project,
  amount,
  setChainInvestmentData
) => {
  try {
    const {
      bridge_harvest,
      bridge_submit_harvest,
      bridge_load_investment,
      bridge_balance,
    } = await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let harvestRes = await bridge_harvest({
      project_id: projectId,
      amount: amount,
      investor_address: myAddress,
    });
    console.log("harvestRes: " + JSON.stringify(harvestRes));
    showProgress(false);

    let harvestResSigned = await signTxs(harvestRes.to_sign);
    console.log("harvestResSigned: " + JSON.stringify(harvestResSigned));

    showProgress(true);
    let submitHarvestRes = await bridge_submit_harvest({
      investor_address_for_diagnostics: myAddress,
      project_id_for_diagnostics: projectId,

      txs: harvestResSigned,
      pt: harvestRes.pt,
    });
    console.log("submitHarvestRes: " + JSON.stringify(submitHarvestRes));

    setChainInvestmentData(
      await bridge_load_investment({
        project_id: projectId,
        app_id: project.central_app_id,
        shares_asset_id: project.shares_asset_id,
        investor_address: myAddress,
      })
    );

    statusMsg.success("Profits retrieved");
    showProgress(false);

    await updateMyBalance(myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const unlock = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  projectId,
  project,
  setChainInvestmentData,
  setYouAreNotInvested
) => {
  try {
    const { bridge_unlock, bridge_submit_unlock, bridge_load_investment } =
      await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let unlockRes = await bridge_unlock({
      project_id: projectId,
      investor_address: myAddress,
    });
    console.log("unlockRes: " + JSON.stringify(unlockRes));
    showProgress(false);

    let unlockResSigned = await signTxs(unlockRes.to_sign);
    console.log("unlockResSigned: " + JSON.stringify(unlockResSigned));

    showProgress(true);
    let submitUnlockRes = await bridge_submit_unlock({
      txs: unlockResSigned,
      pt: unlockRes.pt,
    });
    console.log("submitUnlockRes: " + JSON.stringify(submitUnlockRes));

    setChainInvestmentData(
      await bridge_load_investment({
        project_id: projectId,
        app_id: project.central_app_id,
        shares_asset_id: project.shares_asset_id,
        investor_address: myAddress,
      })
    );

    statusMsg.success("Shares unlocked");
    showProgress(false);
    setYouAreNotInvested(true);

    await updateMyBalance(myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
