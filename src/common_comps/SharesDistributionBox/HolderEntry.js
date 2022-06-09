import React from "react";

export const HolderEntry = ({ entry, isSelected, col }) => {
  if (entry.type_ === "holder") {
    return holderEntry(entry, isSelected, col);
  } else if (entry.type_ === "not_owned") {
    return notOwnedEntry(entry, isSelected);
  }
};

const holderEntry = (entry, isSelected, col) => {
  return (
    <a href={entry.address_browser_link} target="_blank" rel="noreferrer">
      {entryBody(entry, isSelected, col)}
    </a>
  );
};

const notOwnedEntry = (entry, isSelected) => {
  return entryBody(entry, isSelected);
};

const entryBody = (entry, isSelected, col) => {
  var containerClasses = "holder_item__container";
  if (isSelected) {
    containerClasses = containerClasses + " selected";
  }
  return (
    <div className={containerClasses}>
      <div className="percentage-text ft-color-black ft-weight-600">
        {entry.percentage_formatted}
      </div>
      <div>
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8.5" r="8" fill={col} />
        </svg>
      </div>
      <div className="ft-color-black">{entry.label}</div>
    </div>
  );
};
