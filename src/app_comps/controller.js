const wasmPromise = import("wasm");

export const init = async (projectId, setViewProject, statusMsg) => {
  try {
    const { init_log, bridge_view_project } = await wasmPromise;
    await init_log();
    let viewProject = await bridge_view_project({
      project_id: projectId,
    });
    setViewProject(viewProject);
  } catch (e) {
    statusMsg.error(e);
  }
};
