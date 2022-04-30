import React from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";

export const FundsActivityEntry = ({ entry }) => {
  return (
    <a href={entry.tx_link} target="_blank" rel="noreferrer">
      <div className="funds_act_entry">
        <AmountView entry={entry} />
        <div className="funds_act_entry__body">
          <div className="funds_act_entry__date">{entry.date}</div>
          <div>{entry.description}</div>
        </div>
      </div>
    </a>
  );
};

const AmountView = ({ entry }) => {
  var className;
  var text;
  if (entry.is_income === "true") {
    className = "funds_act_entry__amount__income";
    text = "+ " + entry.amount;
  } else if (entry.is_income === "false") {
    className = "funds_act_entry__amount__spending";
    text = "- " + entry.amount;
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
