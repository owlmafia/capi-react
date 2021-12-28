import * as d3 from "d3";

const renderInvestorsShareChart = (container, investorsShare) => {
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

  const nonInvestorsShare = 100 - investorsShare;

  const data = { a: investorsShare, b: nonInvestorsShare };
  const color = d3.scaleOrdinal().range(["#f00", "#000"]);

  const pie = d3.pie().value(function (d) {
    return d[1];
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

export default renderInvestorsShareChart;
