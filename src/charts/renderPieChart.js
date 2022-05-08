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

  const colors = (i, isGray = false) => {
    return isGray ? GRAY : col[Math.round(i % 8)];
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
    .startAngle(-3.5 * Math.PI)
    .endAngle(0.5 * Math.PI);

  const data_ready = pie(data);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  chart
    .append("path")
    .attr("fill", GRAY)
    .attr("d", arc({ startAngle: 0, endAngle: 2 * Math.PI }));

  chart
    .selectAll()
    .data(data_ready)
    .join("path")

    .attr("fill", (d, i) => colors(i, d.data.label === UNUSED))
    .transition()
    .delay(function (_, i) {
      return i * 500;
    })
    .duration(500)
    .attrTween("d", function (d) {
      var i = d3.interpolate(d.startAngle, d.endAngle);
      return function (t) {
        d.endAngle = i(t);
        return arc(d);
      };
    });

  function handleMouseOver(d, i, n) {
    if (i && i.data.label !== UNUSED) {
      d3.select(this).attr("fill", RED);
    }
  }

  function handleMouseOut(d, i) {
    if (i && i.data.label !== UNUSED) {
      d3.select(this).attr("fill", colors(i.index));
    }
  }

  svg
    .selectAll("path")
    .on("mousemove", handleMouseOver)
    .on("mouseout", handleMouseOut);

  svg.selectAll("path").on("click", (p, d) => {
    if (d) {
      onSegmentSelected(d.data);
    }
  });
};

export default renderPieChart;
