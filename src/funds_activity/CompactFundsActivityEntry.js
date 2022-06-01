import React from "react";
import arrowUp from "../images/svg/arrow-up.svg";
import arrowDown from "../images/svg/arrow-down.svg";
import funds from "../images/funds.svg";
import { nestedAmountView } from "./FundsActivityEntry";

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
        width="32px"
        height="32px"
        src={entry.is_income === "true" ? arrowUp : arrowDown}
        alt="arrow"
      />
      <div className="d-flex flex-column gap-4">
        <div className="ft-color-grey">{entry.address}</div>
        <div className="d-flex gap-4">
          <img width="14px" height="14px" src={funds} alt="funds" />
          <div className="ft-size-12 ft-weight-600">
            {nestedAmountView(entry)}
          </div>
          <div className="ft-size-12">{entry.type_label}</div>
        </div>
      </div>
    </div>
  );
};
