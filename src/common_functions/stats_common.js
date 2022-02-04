const wasmPromise = import("wasm");

export const fetchHolderCount = async (
  statusMsg,
  assetId,
  investingEscrowAddress,
  stakingEscrowAddress,
  setHolderCount
) => {
  try {
    const { init_log, bridge_holders_count } = await wasmPromise;
    await init_log();
    let res = await bridge_holders_count({
      asset_id: assetId,
      investing_escrow_address: investingEscrowAddress,
      staking_escrow_address: stakingEscrowAddress,
    });
    console.log("holders count res: " + JSON.stringify(res));
    setHolderCount(res.count);
  } catch (e) {
    statusMsg.error(e);
  }
};
