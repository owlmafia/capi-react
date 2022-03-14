import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { DaoName } from "../ContentTitle";
import { Link } from "react-router-dom";

export const CreateDaoSuccess = (props) => {
  const [investingLinkIsCopied, setInvestingLinkIsCopied] = useState(false);

  const onCopyText = () => {
    setInvestingLinkIsCopied(true);
    setTimeout(() => {
      setInvestingLinkIsCopied(false);
    }, 1000);
  };

  return (
    <div>
      <div>
        <DaoName dao={props.dao} />
        <p>
          <span className="key-val-key">{"Share supply:"}</span>
          <span className="key-val-val">{props.dao.share_supply}</span>
        </p>
        <p>
          <span className="key-val-key">{"Share price:"}</span>
          <span className="key-val-val">{props.dao.share_price}</span>
        </p>
        <p>
          <span className="key-val-key">{"Share asset id:"}</span>
          <span className="key-val-val">
            {" "}
            <a
              href={
                "https://testnet.algoexplorer.io/asset/" +
                props.dao.shares_asset_id
              }
              target="_blank"
              rel="noreferrer"
            >
              {props.dao.shares_asset_id}
            </a>
          </span>
        </p>

        <div className="section-spacer" />
        <CopyToClipboard text={props.dao.invest_link} onCopy={onCopyText}>
          <div>
            <Link to={props.dao.invest_link}>{"Go to project"}</Link>
            <span className="copy">
              {investingLinkIsCopied ? "copied!" : <MdContentCopy />}
            </span>
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
};