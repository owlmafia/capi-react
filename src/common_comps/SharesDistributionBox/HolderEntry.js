import React from "react";

export const HolderEntry = ({ entry }) => {
  return (
    <a href={entry.address_browser_link} target="_blank" rel="noreferrer">
      <div className="holder_item__container">
        <div className="holder_item__address">{entry.short_address}</div>
        <div className="holder_item__percentage">
          {entry.percentage_formatted}
        </div>
      </div>
    </a>
  );
};
