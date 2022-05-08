import React from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";

export const CompactFundsActivityEntry = ({ entry }) => {
  return (
    <div className="funds_act_entry">
      <AmountView entry={entry} />
      <div>{entry.type_label}</div>
      <div>{entry.address}</div>
      <a href={entry.tx_link} target="_blank" rel="noreferrer">
        {"Details"}
      </a>
      <div className="funds_act_entry__body">
        <div className="funds_act_entry__date">{entry.date}</div>
      </div>
    </div>
  );
};

const AmountView = ({ entry }) => {
  var className;
  var text = entry.amount;
  if (entry.is_income === "true") {
    className = "funds_act_entry__amount__income";
  } else if (entry.is_income === "false") {
    className = "funds_act_entry__amount__spending";
  } else {
    throw Error("Invalid entry: " + JSON.stringify(entry));
  }
  return (
    <div className="funds_act_entry__amount__container">
      <FundsAssetImg className="funds_act_entry__amount__logo" />
      <div className={className}>{text}</div>
    </div>
  );
};
