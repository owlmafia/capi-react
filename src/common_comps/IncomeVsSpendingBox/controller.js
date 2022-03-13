const wasmPromise = import("wasm");

export const fetchIncomeVsSpendingChartData = async (statusMsg, daoId) => {
  try {
    const { bridge_income_vs_spending } = await wasmPromise;
    let res = await bridge_income_vs_spending({
      dao_id: daoId,
    });
    console.log("Income and spending chart: %o", res);
    return res;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};
