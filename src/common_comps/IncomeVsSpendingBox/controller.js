const wasmPromise = import("wasm");

export const fetchIncomeVsSpendingChartData = async (statusMsg, projectId) => {
  try {
    const { bridge_income_vs_spending } = await wasmPromise;
    let res = await bridge_income_vs_spending({
      project_id: projectId,
    });
    console.log("Income and spending chart: %o", res);
    return res;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};
