import React, { useEffect, useRef } from "react";
import renderPieChart from "./renderPieChart";

export const SharesDistributionChart = ({ sharesDistr }) => {
  const chart = useRef(null);

  useEffect(() => {
    if (sharesDistr && chart.current) {
      renderPieChart(chart.current, sharesDistr, (d) => d.percentage_number);
    }
    // for now no deps - mutable value doesn't cause a re-render
    //   }, [sharesDistr]);
  });

  return <svg className="pie_chart__svg" ref={chart} />;
};
