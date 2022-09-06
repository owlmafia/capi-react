const wasmPromise = import("wasm");

export const init = async (statusMsg, daoId, setDao) => {
  try {
    const { bridge_load_dao } = await wasmPromise;
    let dao = await bridge_load_dao(daoId);
    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
