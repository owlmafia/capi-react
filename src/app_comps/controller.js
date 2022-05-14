const wasmPromise = import("wasm");

export const initWithDaoId = async (daoId, setViewDao, statusMsg) => {
  try {
    const { bridge_view_dao } = await wasmPromise;
    let res = await bridge_view_dao({
      dao_id: daoId,
    });
    setViewDao(res.dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
