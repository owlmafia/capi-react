import { bridge_income_vs_spending } from "../pkg";

export const fetchIncomeVsSpendingChartData = async (
  statusMsg,
  daoId,
  interval
) => {
  try {
    let res = await bridge_income_vs_spending({
      dao_id: daoId,
      interval: interval,
    });
    console.log("Income and spending chart: %o", res);
    return res;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};
