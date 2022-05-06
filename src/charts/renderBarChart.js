import * as d3 from "d3";

const SUBGROUPARRAY = ["spending", "income"];

const renderBarChart = (svg, flatData, colors) => {
  const margin = { top: 10, right: 10, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  let data = flatData.map((d) => {
    return {
      income: parseFloat(d.income),
      spending: parseFloat(d.spending),
      date: d3.timeFormat("%s")(new Date(d.date)),
    };
  });

  // main x axis settings

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.date).sort(d3.ascending))
    .range([margin.left, width - margin.right])
    .paddingInner([0.5])
    .paddingOuter([0.2]);

  // subgrouping
  const subGroup = d3
    .scaleBand()
    .domain(SUBGROUPARRAY)
    .range([0, x.bandwidth()])
    .padding([0.25]);

  const selected = d3.select(svg);

  // removing existing svgs if any.
  selected.selectAll("*").remove();

  selected
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  selected.append("g").call(d3.axisBottom(x).tickSize(0));

  const yMax = Math.max(
    ...data.map((d) => d.income),
    ...data.map((d) => d.spending)
  );
  console.log(
    Math.max([...data.map((d) => d.income), ...data.map((d) => d.spending)])
  );
  // y axis settings
  const y = d3
    .scaleLinear()
    .domain([0, +1.1 * yMax])
    .range([height - margin.bottom, margin.top]);

  // removes border lines and adds faded strokes for y axis
  selected
    .call(
      d3
        .axisRight(y)
        .tickSize(width - margin.left - margin.right)
        .tickFormat(d3.format(".0s"))
    )
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick:not(:first-of-type) line")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("stroke-opacity", 0.1)
        .attr("stroke-dash", "2,2")
    )
    .call((g) =>
      g.selectAll(".tick text").attr("x", 4).attr("dy", 4).attr("opacity", 0.5)
    );

  // changes the displaying values on x axis
  selected
    .append("g")
    .attr("opacity", 0.5)
    .attr("transform", `translate(0, ${height - 10})`)
    .call(
      d3
        .axisBottom(x)
        .tickSize(0)
        .tickFormat((d) => d3.timeFormat("%d.%m.%y")(new Date(d * 1000)))
    )
    .call((g) => g.select(".domain").remove());

  const colorsRange = d3.scaleOrdinal().domain(SUBGROUPARRAY).range(colors);

  // for rounded corners at the tip
  const [rx, ry] = [4, 4];

  // adds the rounded corner on the top of each bars
  selected
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return `translate(${x(d.date)})`;
    })
    .selectAll("rect")
    .data(function (d) {
      return SUBGROUPARRAY.map(function (key) {
        return { key, value: d[key] };
      });
    })
    .enter()
    .append("path")
    .attr("class", "bars")
    .attr(
      "d",
      (item) =>
        `
      M${subGroup(item.key)},${y(0)}
      a${rx},${ry} 0 0 1 ${rx},${-ry}
      h${subGroup.bandwidth() - 2 * rx}
      a${rx},${ry} 0 0 1 ${rx},${ry}
      v${0}
      h${-subGroup.bandwidth()}Z
    `
    )
    .transition()
    .ease(d3.easeLinear)
    .duration(800)
    .attr("d", (item) =>
      item.value
        ? `
      M${subGroup(item.key)},${y(item.value) + ry}
      a${rx},${ry} 0 0 1 ${rx},${-ry}
      h${subGroup.bandwidth() - 2 * rx}
      a${rx},${ry} 0 0 1 ${rx},${ry}
      v${height - y(item.value) - ry - margin.bottom}
      h${-subGroup.bandwidth()}Z
    `
        : ``
    )

    .attr("fill", function (d) {
      return colorsRange(d.key);
    });
};
export default renderBarChart;
