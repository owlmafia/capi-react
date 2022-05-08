const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const initWithDaoId = async (daoId, setViewDao, statusMsg) => {
  try {
    const { init_log, bridge_view_dao } = await wasmPromise;
    await init_log();
    let res = await bridge_view_dao({
      dao_id: daoId,
    });
    setViewDao(res.dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
