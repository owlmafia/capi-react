const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateApp = async (statusMsg, daoId, owner, version) => {
  try {
    const { bridge_update_app_txs } = await wasmPromise;

    await bridge_update_app_txs({
      dao_id: daoId,
      owner: owner,
      version: version,
    });
    statusMsg.success("App updated!");
  } catch (e) {
    statusMsg.error(e);
  }
};
