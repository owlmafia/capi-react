import React, { useEffect, useState } from "react";
import { IncomeVsSpendingChart } from "../../charts/IncomeVsSpendingChart";
import { LabeledBox } from "../LabeledBox";
import { fetchIncomeVsSpendingChartData } from "./controller";
import Select from "react-select";
import Progress from "../../app_comps/Progress";

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

  const content = () => {
    if (chartData) {
      return (
        <LabeledBox label={"Income and spending"}>
          <Select
            className="charts-select"
            value={selectedBarsInterval}
            onChange={setSelectedBarsInterval}
            options={barsOptions}
          />
          <IncomeVsSpendingChart chartData={chartData} />
        </LabeledBox>
      );
    } else {
      return <Progress />;
    }
  };

  return <div className="charts-container">{content()}</div>;
};
