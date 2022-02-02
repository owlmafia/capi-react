const wasmPromise = import("wasm");

export const init = async (projectId, setViewProject, setFunds, statusMsg) => {
  try {
    const { init_log, bridge_view_project } = await wasmPromise;
    await init_log();
    let viewProject = await bridge_view_project({
      project_id: projectId,
    });
    setViewProject(viewProject);
    // these are overwritten when draining, so we keep them separate
    setFunds(viewProject.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};
