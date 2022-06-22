import React, { useEffect, useMemo, useRef } from "react";
import { ChartLegends } from "./ChartLegends";
import renderBarChart from "./renderBarChart";

export const IncomeVsSpendingChart = ({ chartData, interval }) => {
  const chart = useRef(null);

  const colors = useMemo(() => {
    return ["#DE5C62", "#6BB9BC"];
  }, []);

  useEffect(() => {
    if (chartData && chart.current) {
      renderBarChart(chart.current, chartData.points, colors, interval);
    }
  }, [chartData, colors]);

  return (
    <div className="chart_with_legends_container">
      <ChartLegends
        legends={[
          { color: colors[1], text: "Income" },
          { color: colors[0], text: "Spending" },
        ]}
      />
      <svg ref={chart} />
    </div>
  );
};
