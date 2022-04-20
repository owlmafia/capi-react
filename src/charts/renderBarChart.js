import * as d3 from "d3";

const renderBarChart = (svg, flatData, lineData, lineColors) => {
  // TODO pass parent's dimensions
  const margin = { top: 10, right: 10, bottom: 30, left: 40 },
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  const data = new Map(Object.entries(lineData));

  let flatDataWithD3Dates = flatData.map((d) => {
    return { ...d, date: d3.timeParse("%s")(d.date) };
  });

  const x = d3
    .scaleTime()
    .domain(
      d3.extent(flatDataWithD3Dates, function (d) {
        return d.date;
      })
    )
    .range([0, width]);

  const selected = d3
    .select(svg)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  selected
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(2));

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(flatDataWithD3Dates, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);
  selected
    .append("g")
    .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format(".0s")));

  const lineColorsRange = d3.scaleOrdinal().range(lineColors);

  const isIncome = (d) => {
    return d[0] === "income";
  };

  const point = (d) => {
    return d[1][0];
  };

  const date = (d) => {
    return point(d)?.date;
  };

  const value = (d) => {
    return point(d)?.value;
  };

  const barWidth = 10;
  const separation = 10;

  selected
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", function (d) {
      return lineColorsRange(d[0]);
    })
    .attr("x", function (d) {
      let d3Date = d3.timeParse("%s")(date(d));
      var screenX = x(d3Date) - barWidth / 2;
      if (isIncome(d)) {
        screenX -= separation;
      } else {
        screenX += separation;
      }

      return screenX;
    })
    .attr("y", function (d) {
      return y(+value(d));
    })
    .attr("width", barWidth)
    .attr("height", function (d) {
      return height - y(value(d));
    });
};

export default renderBarChart;
