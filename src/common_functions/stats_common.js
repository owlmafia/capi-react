const wasmPromise = import("wasm");

export const fetchHolderCount = async (statusMsg, assetId, setHolderCount) => {
  try {
    const { init_log, bridge_holders_count } = await wasmPromise;
    await init_log();
    let res = await bridge_holders_count({
      asset_id: assetId,
    });
    console.log("holders count res: " + JSON.stringify(res));
    setHolderCount(res.count);
  } catch (e) {
    statusMsg.error(e);
  }
};
