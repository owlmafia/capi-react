const wasmPromise = import("wasm");

export const fetchSharesDistribution = async (
  statusMsg,
  assetId,
  assetSupply,
  appId,
  setSharesDistr,
  setNotOwnedShares
) => {
  try {
    const { bridge_shares_distribution } = await wasmPromise;
    // let res = await bridge_shares_distribution({
    //   asset_id: assetId,
    //   share_supply: assetSupply,
    //   app_id: appId,
    // });
    let res = {
      holders: [
        {
          address: "",
          label: "Not owned",
          address_browser_link: "",
          amount: "100",
          percentage_formatted: "100 %",
          percentage_number: "1",
          type_: "not_owned",
        },
      ],
      not_owned_shares: "100",
    };
    console.log("Shares distribution res: " + JSON.stringify(res));
    setSharesDistr(res.holders);
    setNotOwnedShares(res.not_owned_shares);
  } catch (e) {
    statusMsg.error(e);
  }
};
