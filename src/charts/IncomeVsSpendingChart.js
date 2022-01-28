import React, { useEffect, useRef } from "react";
import renderMultilineChart from "./renderMultilineChart";

export const IncomeVsSpendingChart = ({ chartData }) => {
  const chart = useRef(null);

  useEffect(() => {
    if (chartData && chart.current) {
      renderMultilineChart(
        chart.current,
        chartData.flat_data_points,
        chartData.chart_lines
      );
    }
  }, [chartData, chart.current]);

  return <svg width={200} height={200} ref={chart} />;
};
