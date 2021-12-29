import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = ({ data, dataNumberSelector }) => {
  console.log("?? data: %o", data);

  const chartRef = useRef(null);

  useEffect(async () => {
    if (chartRef.current) {
      renderChart(chartRef.current, data, dataNumberSelector);
    }
  }, [data, dataNumberSelector, chartRef.current]);

  return <svg width={200} height={200} ref={chartRef} />;
};

const renderChart = (container, data, dataNumberSelector) => {
  // TODO pass parent's dimensions
  const width = 200,
    height = 200,
    margin = 20;

  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal().range(["#f00", "#000", "#ff0", "#00f"]);

  const pie = d3.pie().value(function (d) {
    return dataNumberSelector(d);
  });
  const data_ready = pie(Object.entries(data));

  svg
    .selectAll()
    .data(data_ready)
    .join("path")
    .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
    .attr("fill", function (d) {
      return color(d.data[1]);
    })
    .style("stroke-width", "0px")
    .style("opacity", 1);
};

export default PieChart;
