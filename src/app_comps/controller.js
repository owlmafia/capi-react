const wasmPromise = import("wasm");

export const initWithDaoId = async (daoId, setViewDao, statusMsg) => {
  try {
    const { bridge_load_dao_user_view } = await wasmPromise;
    let dao = await bridge_load_dao_user_view(daoId);
    setViewDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
