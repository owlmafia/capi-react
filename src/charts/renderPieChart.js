import * as d3 from "d3";

const NOT_OWNED = "not_owned";
const GRAY = "#EBECF1";
const RED = "#DF5C60";

// onSegmentSelected has to return selected status, to highlight the segment
const renderPieChart = (
  container,
  data,
  dataNumberSelector,
  onSegmentSelected
) => {
  var width = 300,
    height = 300;

  let outerRadius = (height / 2) * 0.82;
  let innerRadius = (height / 2) * 0.55;

  const col = [
    "#4CA5A9",
    "#8ECACD",
    "#8ECACD",
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

  const segmentClass = (d, i, isGray = false) => {
    return isGray ? "" : "holder_segment";
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
    .attr("fill", (d, i) => colors(d, i, d.data.type_ === NOT_OWNED))
    .attr("class", (d, i) => segmentClass(d, i, d.data.type_ === NOT_OWNED));

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

  const defaultColorsState = () => {
    updatedChart
      .transition()
      .ease(d3.easeLinear)
      .duration(200)
      .attr("fill", (d, i) => colors(d, i, d.data.type_ === NOT_OWNED));
  };

  const selectedColorState = (segment) => {
    d3.select(segment)
      .transition()
      .ease(d3.easeLinear)
      .duration(200)
      .attr("fill", RED);
  };

  function handleOnClick(p, d) {
    if (d && d.data.type_ !== NOT_OWNED) {
      // this is assumed to update the state somewhere up in the hierarchy
      const select = onSegmentSelected(d.data);
      // update UI for returned select status
      // we update like this (instead of only reacting to state change),
      // because it seems to be the easiest way, otherwise the chart re-animates when changing state and tuning that seems more complicated
      // note that we also handle selected state on render, so if for whatever reason the chart re-renders again, it shows correctly
      if (select) {
        defaultColorsState();
        selectedColorState(this);
      } else {
        selectedColorState(this);
        defaultColorsState();
      }
    }
  }

  svg.selectAll("path").on("click", handleOnClick);
};

export default renderPieChart;
