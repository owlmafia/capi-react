const wasmPromise = import("wasm");

export const init = async (daoId, setViewDao, setFunds, statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
  await updateDao(daoId, setViewDao, setFunds, statusMsg);
};

export const updateDao = async (daoId, setViewDao, setFunds, statusMsg) => {
  try {
    const { bridge_view_dao } = await wasmPromise;
    let viewDao = await bridge_view_dao({
      dao_id: daoId,
    });
    setViewDao(viewDao);
    // these are overwritten when draining, so we keep them separate
    // TODO drain here? is this comment up to date?
    setFunds(viewDao.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateFunds_ = async (daoId, setViewDao, setFunds, statusMsg) => {
  /// We don't have a function in WASM yet to fetch only the funds so we re-fetch the dao.
  /// TODO: optimize: fetch only the funds (probably pass escrows/dao as inputs), so request is quicker.
  updateDao(daoId, setViewDao, setFunds, statusMsg);
};
