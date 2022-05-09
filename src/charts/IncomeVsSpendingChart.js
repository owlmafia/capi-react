import React, { useEffect, useMemo, useRef } from "react";
import { ChartLegends } from "./ChartLegends";
import renderBarChart from "./renderBarChart";

export const IncomeVsSpendingChart = ({ chartData }) => {
  const chart = useRef(null);

  const colors = useMemo(() => {
    return ["#6BB9BC", "#DF5C60"];
  }, []);

  useEffect(() => {
    if (chartData && chart.current) {
      renderBarChart(chart.current, chartData.points, colors);
    }
  }, [chartData]);

  return (
    <div className="chart_with_legends_container">
      <svg ref={chart} />
      <ChartLegends
        legends={[
          { color: colors[1], text: "Income" },
          { color: colors[0], text: "Spending" },
        ]}
      />
    </div>
  );
};
