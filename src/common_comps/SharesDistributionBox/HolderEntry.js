import React from "react";

export const HolderEntry = ({ entry, isSelected }) => {
  if (entry.type_ === "holder") {
    return holderEntry(entry, isSelected);
  } else if (entry.type_ === "not_owned") {
    return notOwnedEntry(entry, isSelected);
  }
};

const holderEntry = (entry, isSelected) => {
  return (
    <a href={entry.address_browser_link} target="_blank" rel="noreferrer">
      {entryBody(entry, isSelected)}
    </a>
  );
};

const notOwnedEntry = (entry, isSelected) => {
  return entryBody(entry, isSelected);
};

const entryBody = (entry, isSelected) => {
  var containerClasses = "holder_item__container";
  if (isSelected) {
    containerClasses = containerClasses + " selected";
  }
  return (
    <div className={containerClasses}>
      <div className="percentage-text">{entry.percentage_formatted}</div>
      <div>{entry.label}</div>
    </div>
  );
};
