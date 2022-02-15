// this is a bit messy currently - the funds asset's data is in 3 places:
// - WASM: Asset id (needed for core logic) + decimals (for formatting)
// - React: image
// - React (here): name and possibly other data, when needed to display it (e.g. image tooltip)
// So to change the asset these 3 places have to be edited
// this can be improved but it doesn't seem worth it for now - we'll not change the funds asset frequently
// (if we allow the creator to choose it this must be refactored of course)
export const fundsAssetDisplayData = () => {
  {
    unit: "USDC";
  }
};
