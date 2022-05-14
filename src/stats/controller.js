const wasmPromise = import("wasm");

export const init = async (daoId, setViewDao, statusMsg) => {
  try {
    const { bridge_view_dao } = await wasmPromise;
    let viewDao = await bridge_view_dao({
      dao_id: daoId,
    });
    setViewDao(viewDao);
  } catch (e) {
    statusMsg.error(e);
  }
};
