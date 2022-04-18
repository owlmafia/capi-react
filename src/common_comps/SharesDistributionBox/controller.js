const wasmPromise = import("wasm");

export const fetchSharesDistribution = async (
  statusMsg,
  assetId,
  assetSupply,
  appId,
  investingEscrowAddress
) => {
  try {
    const { bridge_shares_distribution } = await wasmPromise;
    let res = await bridge_shares_distribution({
      asset_id: assetId,
      share_supply: assetSupply,
      app_id: appId,
      investing_escrow_address: investingEscrowAddress,
    });
    console.log("Shares distribution res: " + JSON.stringify(res));
    return res.holders;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};
