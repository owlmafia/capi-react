const wasmPromise = import("wasm");

export const init = async (projectId, setViewProject, setFunds, statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
  await updateProject(projectId, setViewProject, setFunds, statusMsg);
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
    setViewProject(viewProject);
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
