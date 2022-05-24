const wasmPromise = import("wasm");

export const initWithDaoId = async (daoId, setViewDao, statusMsg) => {
  try {
    const { bridge_load_dao } = await wasmPromise;
    let dao = await bridge_load_dao(daoId);
    setViewDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
