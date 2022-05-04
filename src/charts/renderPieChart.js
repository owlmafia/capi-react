import * as d3 from "d3";
const renderPieChart = (container, data, dataNumberSelector) => {
  console.log("Rendering pie chart, data: %o", data);

  var margin = { top: 20, bottom: 20, right: 20, left: 20 },
    width = 280,
    height = 280;

  let outerRadius = (height / 2) * 0.6;
  let innerRadius = (height / 2) * 0.4;

  const getCoordinates = (angle, radius, svgSize) => {
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    const coordX = x * radius + svgSize / 2;
    const coordY = y * -radius + svgSize / 2;
    return [coordX, coordY].join(" ");
  };

  const svg = d3.select(container);

  svg.selectAll("*").remove();

  svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

  const colors = (i) => d3.interpolateBlues(i / data.length);
  var pie = d3
    .pie()
    .value(function (d) {
      return +dataNumberSelector(d);
    })
    .startAngle(-Math.PI)
    .endAngle(Math.PI);

  const data_ready = pie(data);

  svg
    .selectAll()
    .data(data_ready)
    .join("path")
    .attr("fill", (data) => colors(data.index))
    .transition()
    .delay(function (_, i) {
      return i * 50;
    })
    .duration(50)
    .attrTween("d", function (d) {
      var i = d3.interpolate(d.startAngle, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return `M ${getCoordinates(
          d.startAngle,
          outerRadius,
          width
        )} A ${5} ${5} 0 ${0} 0 ${getCoordinates(d.startAngle, innerRadius, width)} A ${innerRadius} ${innerRadius} 0 ${0} 0 ${getCoordinates(d.endAngle, innerRadius, width)} A ${5} ${5} 0 ${0} 1  ${getCoordinates(d.endAngle, outerRadius, width)}A ${outerRadius} ${outerRadius} 0 ${0} 1 ${getCoordinates(d.startAngle, outerRadius, width)}`;
      };
    })
    .attr("stroke", (d) => colors(d.index))
    .attr("stroke-width", 0.2);

  function handleMouseOver(d, i, n) {
    d3.select(this)
      .attr("stroke", colors(i.index))
      .attr("stroke-width", 5)
      .raise();
  }

  function handleMouseOut(d, i) {
    d3.select(this).attr("stroke-width", 0.2);
    d3.select(this)
      .transition()
      .duration(500)
      .attr("transform", "translate(0,0)");
  }

  svg
    .selectAll("path")
    .on("mousemove", handleMouseOver)
    .on("mouseout", handleMouseOut);

  svg.selectAll("path").on("click", (d, i, n) => {
    console.log(d, i, n);
  });
};

export default renderPieChart;
