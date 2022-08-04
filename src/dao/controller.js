const wasmPromise = import("wasm");

export const loadDescription = async (deps, setDescription) => {
  try {
    if (deps.dao && deps.dao.descr_url) {
      const { bridge_description } = await wasmPromise;
      let description = await bridge_description(deps.dao.descr_url);
      setDescription(description);
    } else {
      setDescription("");
    }
  } catch (e) {
    deps.statusMsg.error(e);
  }
};
