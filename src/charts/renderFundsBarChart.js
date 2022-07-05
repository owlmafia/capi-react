import * as d3 from "d3";
import moment from "moment";

const renderFundsProgressChart = (
  svg,
  dao,
  formattedRaisedFunds,
  raisedFundsNumber,
  successColors
) => {
  // TODO start date - dao currently doesn't store this
  let textTopLeft = moment.unix(0).format("D MMM YYYY");
  let textBottomLeft = "0";
  let textTopRight = moment.unix(dao.raise_end_date).format("D MMM YYYY");
  let textBottomRight = dao.total_raisable;

  const minFunds = dao.raise_min_target_number;
  const formattedMinFunds = dao.raise_min_target;
  const maxFunds = dao.total_raisable_number;

  const margin = { top: 30, right: 10, bottom: 30, left: 40 },
    width = 600 - margin.right;

  const barHeight = 15;
  const radius = 10;

  // these could be calculated, but there was some weirdness with text baseline etc, so manually.
  const bottomLabelsOffset = 12;
  const topLabelsOffset = -5;
  const topLabelsY = margin.top + topLabelsOffset;
  const bottomLabelsY = margin.top + barHeight + bottomLabelsOffset;

  const totalWidth = width + margin.left + margin.right;
  const totalHeight = barHeight + margin.top + margin.bottom;

  const selected = d3.select(svg);

  const x = d3.scaleLinear().domain([0, maxFunds]).range([0, totalWidth]);

  // removing existing svgs if any
  selected.selectAll("*").remove();

  selected.attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`);

  selected
    .append("rect")
    // .attr("class", "bg-rect")
    .attr("rx", radius)
    .attr("ry", radius)
    .attr("fill", "gray")
    .attr("height", barHeight)
    .attr("width", totalWidth)
    .attr("x", 0)
    .attr("y", margin.top);

  const barColor = successColors ? "cyan" : "red";

  var progress = selected
    .append("rect")
    // .attr("class", "progress-rect")
    .attr("fill", barColor)
    .attr("height", barHeight)
    .attr("width", 0)
    .attr("rx", radius)
    .attr("ry", radius)
    .attr("x", 0)
    .attr("y", margin.top);

  // animate progress
  progress
    .transition()
    .duration(1000)
    .attr("width", function () {
      return x(raisedFundsNumber);
    });

  // raised funds label
  const raisedFundsTextSize = calculateTextSize(formattedRaisedFunds);
  const raisedLabel = selected
    .append("text")
    .text(formattedRaisedFunds)
    .attr("fill", "black")
    .attr("font-size", 10)
    .attr("font-weight", 600)
    .attr("x", 0)
    .attr("opacity", 0)
    // .attr("x", x.bandwidth() * data.length + margin.left)
    // .attr("dominant-baseline", "central")
    // .attr("alignment-baseline", "central")
    // .attr("y", (barHeight - textSize.height) / 2 - textSize.height / 2);
    // .attr("x", function () {
    //   // - 8: offset from bar end
    //   return x(raisedFundsNumber) - raisedFundsTextSize.width - 8;
    // })
    .attr("y", margin.top + 11); // offset: center text manually

  // animate funds label
  raisedLabel
    .transition()
    .duration(1000)
    .attr("opacity", 1)
    .attr("x", function () {
      // - 8: offset from bar end
      return x(raisedFundsNumber) - raisedFundsTextSize.width - 14;
    });

  // min funds label
  const minFundsTextSize = calculateTextSize(formattedMinFunds);
  surroundingBottomLabel(selected, formattedMinFunds)
    .attr("x", function () {
      return x(minFunds) - minFundsTextSize.width / 2;
    })
    .attr("y", margin.top + barHeight + 12);

  // min funds line
  selected
    .append("line")
    .attr("stroke", "black")
    .style("stroke-width", 0.5)
    .style("stroke-dasharray", "1.5, 1.5")
    .attr("x1", function (d) {
      return x(minFunds);
    })
    .attr("y1", function (d) {
      return margin.top;
    })
    .attr("x2", function (d) {
      return x(minFunds);
    })
    .attr("y2", function (d) {
      return barHeight + margin.top;
    });

  surroundingTopLabel(selected, textTopLeft)
    .attr("x", function () {
      return x(0);
    })
    .attr("y", topLabelsY);

  surroundingBottomLabel(selected, textBottomLeft)
    .attr("x", function () {
      return x(0);
    })
    .attr("y", bottomLabelsY);

  const textCTextSize = calculateTextSize(textTopRight + "");
  surroundingTopLabel(selected, textTopRight)
    .attr("x", function () {
      return x(maxFunds) - textCTextSize.width;
    })
    .attr("y", topLabelsY);

  const textDTextSize = calculateTextSize(textBottomRight + "");
  surroundingBottomLabel(selected, textBottomRight)
    .attr("x", function () {
      return x(maxFunds) - textDTextSize.width;
    })
    .attr("y", bottomLabelsY);
};
export default renderFundsProgressChart;

const calculateTextSize = (text) => {
  var container = d3.select("body").append("svg");
  container
    .append("text")
    .attr("font-size", 10)
    .attr("font-weight", 600)
    .attr("x", -99999)
    .attr("y", -99999)
    .text(text);
  var size = container.node().getBBox();
  container.remove();
  return { width: size.width, height: size.height };
};

const surroundingTopLabel = (svg, text) => {
  return surroundingLabel(svg, text).attr("class", "funds-progress-text-top");
};

const surroundingBottomLabel = (svg, text) => {
  return surroundingLabel(svg, text).attr(
    "class",
    "funds-progress-text-bottom"
  );
};

const surroundingLabel = (svg, text) => {
  return svg
    .append("text")
    .text(text)
    .attr("fill", "black")
    .attr("font-size", 10)
    .attr("font-weight", 600)
    .attr("class", "funds-progress-text-bottom");
};
