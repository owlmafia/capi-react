import React from "react";

export const ChartLegends = ({ legends }) => {
  const legendsViews = () => {
    return (
      legends &&
      legends.length > 0 && (
        <div class="chart_legends_container">
          {legends.map((legend) => (
            <ChartLegend legend={legend} />
          ))}
        </div>
      )
    );
  };

  return <div class="chart_legends_container"> {legendsViews()} </div>;
};

const ChartLegend = ({ legend }) => {
  return (
    <div class="chart_legend__container">
      <svg className="chart_legend__color" fill={legend.color}>
        <circle cx="50%" cy="50%" r="4" />
      </svg>
      <span className="chart_legend__text">{legend.text}</span>
    </div>
  );
};
