const wasmPromise = import("wasm");

export const init = async (daoId, setDao, statusMsg) => {
  try {
    const { bridge_load_dao_user_view } = await wasmPromise;
    let dao = await bridge_load_dao_user_view(daoId);
    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
