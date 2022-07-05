import React from "react";
import arrowUp from "../images/svg/arrow-up.svg";
import arrowDown from "../images/svg/arrow-down.svg";
import funds from "../images/funds.svg";
import {
  fundsActivityEntryLabel,
  nestedAmountView,
} from "./FundsActivityEntry";

export const CompactFundsActivityEntry = ({ entry }) => {
  return (
    <div className="funds_act_entry">
      <AmountView entry={entry} />
      <div className="funds_act_entry__body">
        <div className="funds_act_entry__date">{entry.date}</div>
        <a
          className="details"
          href={entry.tx_link}
          target="_blank"
          rel="noreferrer"
        >
          {"Details"}
        </a>
      </div>
    </div>
  );
};

const AmountView = ({ entry }) => {
  return (
    <div className="funds_act_entry__amount__container">
      <img
        className="arrow-icon d-mobile-none"
        src={entry.is_income === "true" ? arrowUp : arrowDown}
        alt="arrow"
      />
      <div className="d-flex flex-column justify-between">
        <div className="ft-color-grey ft-size-18 line-height-1">
          {entry.address}
        </div>
        <div className="d-flex align-center">
          <img
            className="arrow funds-arrow-icon tablet-desktop-none"
            src={entry.is_income === "true" ? arrowUp : arrowDown}
            alt="arrow"
          />
          <img
            className="opacity-50 mr-5"
            width="16px"
            height="16px"
            src={funds}
            alt="funds"
          />
          <div className="ft-weight-600">{nestedAmountView(entry)}</div>
          <div className="ft-size-14 type-label">
            {fundsActivityEntryLabel(entry)}
          </div>
        </div>
      </div>
    </div>
  );
};
