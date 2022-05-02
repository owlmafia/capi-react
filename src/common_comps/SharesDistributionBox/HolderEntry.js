import React from "react";

export const HolderEntry = ({ entry }) => {
  if (entry.type_ === "holder") {
    return holderEntry(entry);
  } else if (entry.type_ === "not_owned") {
    return notOwnedEntry(entry);
  }
};

const holderEntry = (entry) => {
  return (
    <a href={entry.address_browser_link} target="_blank" rel="noreferrer">
      {entryBody(entry)}
    </a>
  );
};

const notOwnedEntry = (entry) => {
  return entryBody(entry);
};

const entryBody = (entry) => {
  return (
    <div className="holder_item__container">
      <div className="percentage-text">{entry.percentage_formatted}</div>
      <div>{entry.label}</div>
    </div>
  );
};
