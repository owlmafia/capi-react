const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadMyProjects = async (statusMsg, address, setMyProjects) => {
  try {
    const { bridge_my_projects } = await wasmPromise;

    const myProjectsRes = await bridge_my_projects({
      address: address,
    });
    console.log("myProjectsRes: " + JSON.stringify(myProjectsRes));

    setMyProjects(myProjectsRes.projects);
  } catch (e) {
    statusMsg.error(e);
  }
};
