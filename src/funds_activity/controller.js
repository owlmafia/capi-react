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
  creatorAddress,
  setActivityEntries,
  maxResults // null if it shouldn't be limited
) => {
  try {
    const { bridge_load_funds_activity } = await wasmPromise;

    const fundsActivityRes = await bridge_load_funds_activity({
      dao_id: daoId,
      creator_address: creatorAddress,
      max_results: maxResults,
    });
    console.log("fundsActivityRes: " + JSON.stringify(fundsActivityRes));

    setActivityEntries(fundsActivityRes.entries);
  } catch (e) {
    statusMsg.error(e);
  }
};
