const wasmPromise = import("wasm");

export const fetchSharesDistribution = async (
  statusMsg,
  assetId,
  assetSupply,
  appId,
  investingEscrowAddress,
  stakingEscrowAddress
) => {
  try {
    const { bridge_shares_distribution } = await wasmPromise;
    let res = await bridge_shares_distribution({
      asset_id: assetId,
      asset_supply: assetSupply,
      app_id: appId,
      investing_escrow_address: investingEscrowAddress,
      staking_escrow_address: stakingEscrowAddress,
    });
    console.log("Shares distribution res: " + JSON.stringify(res));
    return res.holders;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};
