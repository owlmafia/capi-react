import React, { useEffect, useState } from "react";
import { IncomeVsSpendingChart } from "../../charts/IncomeVsSpendingChart";
import { LabeledBox } from "../LabeledBox";
import { fetchIncomeVsSpendingChartData } from "./controller";
import Select from "react-select";

const barsOptions = [
  { value: "days7", label: "Last 7 days" },
  { value: "months3", label: "Last 3 months" },
  { value: "year", label: "Last year" },
];

export const IncomeVsSpendingBox = ({ statusMsg, daoId }) => {
  const [chartData, setChartData] = useState(null);

  const [selectedBarsInterval, setSelectedBarsInterval] = useState(
    barsOptions[0]
  );
  useEffect(() => {
    async function fetchData() {
      const chartData = await fetchIncomeVsSpendingChartData(
        statusMsg,
        daoId,
        selectedBarsInterval.value
      );
      setChartData(chartData);
    }
    fetchData();
  }, [statusMsg, daoId, selectedBarsInterval]);

  return (
    <LabeledBox label={"Income and spending"}>
      <Select
        value={selectedBarsInterval}
        onChange={setSelectedBarsInterval}
        options={barsOptions}
      />
      <IncomeVsSpendingChart chartData={chartData} />
    </LabeledBox>
  );
};
