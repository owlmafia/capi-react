import { LabeledBox } from "../LabeledBox";
import React, { useEffect, useState } from "react";
import { IncomeVsSpendingChart } from "../../charts/IncomeVsSpendingChart";
import { fetchIncomeVsSpendingChartData } from "./controller";

export const IncomeVsSpendingBox = ({ statusMsg, projectId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(async () => {
    const chartData = await fetchIncomeVsSpendingChartData(
      statusMsg,
      projectId
    );
    setChartData(chartData);
  }, [projectId]);

  return (
    <LabeledBox label={"Income and spending"}>
      <IncomeVsSpendingChart chartData={chartData} />
    </LabeledBox>
  );
};
