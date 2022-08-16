import React, { Fragment } from "react";
import arrowUp from "../images/svg/arrow-up.svg";
import arrowDown from "../images/svg/arrow-down.svg";
import funds from "../images/funds.svg";
import ReactTooltip from "react-tooltip";

export const FundsActivityEntry = ({ deps, entry }) => {
  if (deps.size.s4) {
    return mobileEntryView(entry);
  } else {
    return desktopEntryView(entry);
  }
};

const desktopEntryView = (entry) => {
  return (
    <div className="funds_act_entry">
      <AmountView entry={entry} />
      <div className="funds_act_entry__body">
        <div className="d-flex align-center">
          <div className="desc black">{entry.address}</div>
          <div className="ellipse"></div>
          <div className="grey-220 ft-size-14">
            {fundsActivityEntryLabel(entry)}
          </div>
        </div>
        <div className="description">{entry.description}</div>
      </div>
      {detailsLink(entry)}
    </div>
  );
};

const mobileEntryView = (entry) => {
  return (
    <div className="funds_act_entry-tab">
      <img
        className="arrow funds-arrow-icon d-mobile-none"
        src={entry.is_income === "true" ? arrowUp : arrowDown}
        alt="arrow"
      />
      <div className="funds_act_entry__body">
        <div className="d-flex align-center order-2">
          <div className="wallet">{entry.address}</div>
          <div className="ellipse tablet-none"></div>
        </div>
        <div className="d-flex align-center order-1">
          <AmountView entry={entry} />
          <div className="status">{fundsActivityEntryLabel(entry)}</div>
        </div>
        <div className="description order-3">{entry.description}</div>
      </div>
      {detailsLink(entry)}
    </div>
  );
};

const detailsLink = (entry) => {
  return (
    <div className="funds_act_entry__details">
      <div className="funds_act_entry__date">{entry.date}</div>
      <a href={entry.tx_link} target="_blank" rel="noreferrer">
        {"Details"}
      </a>
    </div>
  );
};

export const fundsActivityEntryLabel = (entry) => {
  if (entry.is_income === "true") {
    return "Income";
  } else {
    return "Withdrawal";
  }
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
        className="arrow funds-arrow-icon tablet-none"
        src={entry.is_income === "true" ? arrowUp : arrowDown}
        alt="arrow"
      />
      <img className="funds-dollar-icon" src={funds} alt="funds" />

      <div className={className}>{nestedAmountView(entry)}</div>
    </div>
  );
};

export const nestedAmountView = (entry) => {
  if (entry.amount_without_fee !== entry.short_amount_without_fee) {
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
