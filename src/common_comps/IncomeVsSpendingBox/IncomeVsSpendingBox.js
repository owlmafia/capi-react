import React, { useEffect, useState } from "react";
import { IncomeVsSpendingChart } from "../../charts/IncomeVsSpendingChart";
import { LabeledBox } from "../LabeledBox";
import { fetchIncomeVsSpendingChartData } from "./controller";

export const IncomeVsSpendingBox = ({ statusMsg, daoId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const chartData = await fetchIncomeVsSpendingChartData(statusMsg, daoId);
      setChartData(chartData);
    }
    fetchData();
  }, [statusMsg, daoId]);

  return (
    <LabeledBox label={"Income and spending"}>
      <IncomeVsSpendingChart chartData={chartData} />
    </LabeledBox>
  );
};
