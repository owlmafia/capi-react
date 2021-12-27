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

export const loadWithdrawals = async (
  statusMsg,
  projectUuid,
  creatorAddress,
  setWithdrawalRequests
) => {
  try {
    const { bridge_load_withdrawals } = await wasmPromise;

    const withdrawalsRes = await bridge_load_withdrawals({
      project_uuid: projectUuid,
      creator_address: creatorAddress,
    });
    console.log("withdrawalsRes: " + JSON.stringify(withdrawalsRes));

    setWithdrawalRequests(withdrawalsRes.entries);
  } catch (e) {
    statusMsg.error(e);
  }
};
