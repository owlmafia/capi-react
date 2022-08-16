import React, { useEffect, useState, useMemo, useRef } from "react";
import { LabeledBox } from "../common_comps/LabeledBox";
import { fetchIncomeVsSpendingChartData } from "./controller";
import Select from "react-select";
import Progress from "../common_comps/Progress";
import { ChartLegends } from "../charts/ChartLegends";
import renderBarChart from "../charts/renderBarChart";

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

  const chart = useRef(null);

  const colors = useMemo(() => {
    return ["#DE5C62", "#6BB9BC"];
  }, []);

  useEffect(() => {
    async function fetchData() {
      const chartData = await fetchIncomeVsSpendingChartData(
        statusMsg,
        daoId,
        selectedBarsInterval.value
      );
      setChartData(chartData);

      if (chartData && chart.current) {
        renderBarChart(
          chart.current,
          chartData.points,
          colors,
          selectedBarsInterval.value
        );
      }
    }
    fetchData();
  }, [statusMsg, daoId, selectedBarsInterval.value, colors]);

  const content = () => {
    if (chartData) {
      return (
        <LabeledBox label={"Income and spending"}>
          <div className="d-flex flex-column gap-24">
            <div className="select-legend-container">
              <div className="spacer"></div>
              <ChartLegends
                legends={[
                  { color: colors[1], text: "Income" },
                  { color: colors[0], text: "Spending" },
                ]}
              />
              <Select
                className="charts-select"
                value={selectedBarsInterval}
                onChange={setSelectedBarsInterval}
                options={barsOptions}
              />
            </div>
            <svg className="mb--40" ref={chart} />
          </div>
        </LabeledBox>
      );
    } else {
      return <Progress />;
    }
  };

  return <div className="charts-container mt-80">{content()}</div>;
};
