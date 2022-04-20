import React, { useEffect, useMemo, useRef } from "react";
import { ChartLegends } from "./ChartLegends";
import renderBarChart from "./renderBarChart";

export const IncomeVsSpendingChart = ({ chartData }) => {
  const chart = useRef(null);

  const lineColors = useMemo(() => {
    // HACK: TODO: derive correctly colors / legends from data. Currently e.g. order and count of lines is assumed when defining legends.
    return ["#377eb8", "#e41a1c"];
  }, []);

  useEffect(() => {
    if (chartData && chart.current) {
      renderBarChart(
        chart.current,
        chartData.flat_data_points,
        chartData.chart_lines,
        lineColors
      );
    }
    // for now no deps - mutable value doesn't cause a re-render
    //   }, [chartData, lineColors]);
  });

  return (
    <div className="chart_with_legends_container">
      <svg width={200} height={200} ref={chart} />
      <ChartLegends
        legends={[
          { color: lineColors[1], text: "Income" },
          { color: lineColors[0], text: "Spending" },
        ]}
      />
    </div>
  );
};
