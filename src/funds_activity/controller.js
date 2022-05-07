const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadFundsActivity = async (
  statusMsg,
  daoId,
  ownerAddress,
  setActivityEntries,
  maxResults // null if it shouldn't be limited
) => {
  try {
    const { bridge_load_funds_activity } = await wasmPromise;

    const fundsActivityRes = await bridge_load_funds_activity({
      dao_id: daoId,
      owner_address: ownerAddress,
      max_results: maxResults,
    });
    console.log("fundsActivityRes: " + JSON.stringify(fundsActivityRes));

    setActivityEntries(fundsActivityRes.entries);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadDao = async (statusMsg, daoId, setDao) => {
  try {
    const { bridge_load_dao_user_view } = await wasmPromise;

    let dao = await bridge_load_dao_user_view(daoId);
    console.log("dao: " + JSON.stringify(dao));
    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
