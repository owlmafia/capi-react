import * as d3 from "d3";

const renderPieChart = (container, data, dataNumberSelector) => {
  console.log("Rendering pie chart, data: %o", data);

  // For now the same for all pie charts: we also use a global value in CSS
  // note that value in CSS (pie_chart_diameter) has to be identical
  let diameter = 160;

  const radius = diameter / 2;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", `translate(${diameter / 2}, ${diameter / 2})`);

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

export default renderPieChart;
