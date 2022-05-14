import React, { useEffect, useRef } from "react";
import renderPieChart from "./renderPieChart";

// onAddressSelected has to return selected status, to highlight the segment
export const SharesDistributionChart = ({ sharesDistr, onAddressSelected }) => {
  const chart = useRef(null);

  useEffect(() => {
    if (sharesDistr && chart.current) {
      renderPieChart(
        chart.current,
        sharesDistr,
        (d) => d.percentage_number,
        (d) => {
          return onAddressSelected(d.address);
        }
      );
    }
  }, [onAddressSelected, sharesDistr]);

  return <svg className="pie_chart__svg" ref={chart} />;
};
