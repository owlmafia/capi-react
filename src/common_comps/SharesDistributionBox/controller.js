const wasmPromise = import("wasm");

export const fetchSharesDistribution = async (
  statusMsg,
  assetId,
  assetSupply
) => {
  try {
    const { bridge_shares_distribution } = await wasmPromise;
    let res = await bridge_shares_distribution({
      asset_id: assetId,
      asset_supply: assetSupply,
    });
    console.log("Shares distribution res: " + JSON.stringify(res));
    return res.holders;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};
