const wasmPromise = import("wasm");

export const init = async (daoId, setViewDao, statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
  await updateDao(daoId, setViewDao, statusMsg);
};

export const updateDao = async (daoId, setViewDao, statusMsg) => {
  try {
    const { bridge_view_dao } = await wasmPromise;
    let viewDao = await bridge_view_dao({
      dao_id: daoId,
    });
    setViewDao(viewDao);
    // // these are overwritten when draining, so we keep them separate
    // // TODO drain here? is this comment up to date?
    // setFunds(viewDao.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};
