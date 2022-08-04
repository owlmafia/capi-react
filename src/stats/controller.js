const wasmPromise = import("wasm");

export const init = async (deps, daoId, setDao) => {
  try {
    const { bridge_load_dao } = await wasmPromise;
    let dao = await bridge_load_dao(daoId);
    setDao(dao);
  } catch (e) {
    deps.statusMsg.error(e);
  }
};
