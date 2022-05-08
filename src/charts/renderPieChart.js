import * as d3 from "d3";

const UNUSED = "Not owned";
const GRAY = "#EBECF1";
const RED = "#DF5C60";
const renderPieChart = (
  container,
  data,
  dataNumberSelector,
  onSegmentSelected
) => {
  console.log("Rendering pie chart, data: %o", data);

  var width = 300,
    height = 300;

  let outerRadius = (height / 2) * 0.6;
  let innerRadius = (height / 2) * 0.4;

  const col = [
    "#7FB7BB",
    "#AFD5D6",
    "#A1CDD0",
    "#BCDBDF",
    "#C8E3E3",
    "#D9E9EB",
    "#E4F0F1",
    "#F1F8F8",
  ];

  const colors = (d, i, isGray = false) => {
    if (d && d.data.isSelected) {
      return RED;
    } else {
      return isGray ? GRAY : col[Math.round(i % 8)];
    }
  };

  const svg = d3.select(container);

  svg.selectAll("*").remove();

  const chart = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  var pie = d3
    .pie()
    .value(function (d) {
      return +dataNumberSelector(d);
    })
    .sort(null)
    .startAngle(0.5 * Math.PI)
    .endAngle(3.5 * Math.PI);

  const data_ready = pie(data);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  chart
    .append("path")
    .attr("fill", GRAY)
    .attr("d", arc({ startAngle: 0, endAngle: 2 * Math.PI }));

  const updatedChart = chart
    .selectAll()
    .data(data_ready)
    .join("path")
    .attr("fill", (d, i) => colors(d, i, d.data.label === UNUSED));

  let angleInterpolation = d3.interpolate(pie.startAngle()(), pie.endAngle()());
  updatedChart
    .transition()
    .ease(d3.easeLinear)
    .duration(2000)
    .attrTween("d", (d) => {
      let originalEnd = d.endAngle;
      return (t) => {
        let currentAngle = angleInterpolation(t);
        if (currentAngle < d.startAngle) {
          return "";
        }
        d.endAngle = Math.min(currentAngle, originalEnd);

        return arc(d);
      };
    });

  function handleOnClick(p, d) {
    if (d) {
      onSegmentSelected(d.data);
    }
    if (d.data.label !== UNUSED) {
      updatedChart
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr("fill", (d, i) => colors(d, i, d.data.label === UNUSED));
      d3.select(this)
        .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr("fill", RED);
    }
  }

  svg.selectAll("path").on("click", handleOnClick);
};

export default renderPieChart;
