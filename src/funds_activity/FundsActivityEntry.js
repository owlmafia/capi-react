import React, { Fragment } from "react";
import arrowUp from "../images/svg/arrow-up.svg";
import arrowDown from "../images/svg/arrow-down.svg";
import funds from "../images/funds.svg";
import ReactTooltip from "react-tooltip";

export const FundsActivityEntry = ({ entry }) => {
  return (
    <div>
      <div className="funds_act_entry">
        <AmountView entry={entry} />
        <div className="funds_act_entry__body">
          <div className="d-flex align-center">
            <div className="ft-weight-600 ft-color-grey">{entry.address}</div>
            <div className="ellipse"></div>
            <div className="ft-color-black ft-size-14">{entry.type_label}</div>
          </div>
          <div className="description">{entry.description}</div>
        </div>
        <div className="details">
          <div className="funds_act_entry__date">{entry.date}</div>
          <a
            className="ft-weight-600"
            href={entry.tx_link}
            target="_blank"
            rel="noreferrer"
          >
            {"Details"}
          </a>
        </div>
      </div>
      <div className="funds_act_entry-tab">
        <div className="funds_act_entry__body">
          <div className="d-flex align-center">
            <div className="ft-weight-600 ft-color-grey">{entry.address}</div>
          </div>
          <div className="d-flex align-center gap-32">
            <AmountView entry={entry} />
            <div className="ft-color-black ft-size-14 ft-color-grey">
              {entry.type_label}
            </div>
          </div>
          <div className="description">{entry.description}</div>
        </div>
        <div className="details">
          <div className="funds_act_entry__date">{entry.date}</div>
          <a
            className="ft-weight-600"
            href={entry.tx_link}
            target="_blank"
            rel="noreferrer"
          >
            {"Details"}
          </a>
        </div>
      </div>
    </div>
  );
};

const AmountView = ({ entry }) => {
  var className;
  if (entry.is_income === "true") {
    className = "funds_act_entry__amount__number";
  } else if (entry.is_income === "false") {
    className = "funds_act_entry__amount__number";
  } else {
    throw Error("Invalid entry: " + JSON.stringify(entry));
  }
  return (
    <div className="funds_act_entry__amount__container">
      <img
        width="48px"
        height="48px"
        src={entry.is_income === "true" ? arrowUp : arrowDown}
        alt="arrow"
      />
      <img src={funds} alt="funds" />

      <div className={className}>{nestedAmountView(entry)}</div>
    </div>
  );
};

export const nestedAmountView = (entry) => {
  if (entry.amount_without_fee != entry.short_amount_without_fee) {
    return (
      <Fragment>
        <div data-tip={entry.amount_without_fee}>
          {entry.short_amount_without_fee}
        </div>
        <ReactTooltip />
      </Fragment>
    );
  } else {
    return entry.short_amount_without_fee;
  }
};
