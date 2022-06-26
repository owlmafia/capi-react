const wasmPromise = import("wasm");

export const loadDescription = async (
  statusMsg,
  descriptionId,
  setDescription
) => {
  try {
    const { bridge_description } = await wasmPromise;
    let description = await bridge_description(descriptionId);
    setDescription(description);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadRaisedFunds = async (
  statusMsg,
  daoId,
  setRaisedFunds,
  setRaisedFundsNumber
) => {
  try {
    const { bridge_raised_funds } = await wasmPromise;
    let funds = await bridge_raised_funds({ dao_id: daoId });
    setRaisedFunds(funds.raised);
    setRaisedFundsNumber(funds.raised_number);
  } catch (e) {
    statusMsg.error(e);
  }
};
