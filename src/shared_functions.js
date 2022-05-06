const wasmPromise = import("wasm");

export const updateInvestmentData_ = async (
  statusMsg,
  myAddress,
  daoId,
  setChainInvestmentData
) => {
  try {
    const { bridge_load_investment } = await wasmPromise;

    if (myAddress) {
      let data = await bridge_load_investment({
        dao_id: daoId,
        investor_address: myAddress,
      });
      console.log("Investment data: %o", data);
      setChainInvestmentData(data);
    }
  } catch (e) {
    statusMsg.error(e);
  }
};
