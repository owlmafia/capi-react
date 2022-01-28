import React, { useEffect, useRef } from "react";
import renderPieChart from "./renderPieChart";

export const SharesDistributionChart = ({ sharesDistr }) => {
  const chart = useRef(null);

  useEffect(() => {
    if (sharesDistr && chart.current) {
      renderPieChart(chart.current, sharesDistr, (d) => d[1].percentage_number);
    }
  }, [sharesDistr, chart.current]);

  return <svg class="pie_chart__svg" ref={chart} />;
};
