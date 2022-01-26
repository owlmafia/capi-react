import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { ProjectName } from "../ContentTitle";

export const CreateProjectSuccess = (props) => {
  const [investingLinkIsCopied, setInvestingLinkIsCopied] = useState(false);

  const onCopyText = () => {
    setInvestingLinkIsCopied(true);
    setTimeout(() => {
      setInvestingLinkIsCopied(false);
    }, 1000);
  };

  return (
    <div>
      <div className="container">
        <ProjectName project={props.project} />
        <p>
          <span className="key-val-key">{"Share supply:"}</span>
          <span className="key-val-val">{props.project.share_supply}</span>
        </p>
        <p>
          <span className="key-val-key">{"Share price:"}</span>
          <span className="key-val-val">{props.project.share_price}</span>
        </p>
        <p>
          <span className="key-val-key">{"Share asset id:"}</span>
          <span className="key-val-val">
            {" "}
            <a
              href={
                "https://testnet.algoexplorer.io/asset/" +
                props.project.shares_asset_id
              }
              target="_blank"
              rel="noreferrer"
            >
              {props.project.shares_asset_id}
            </a>
          </span>
        </p>

        <div className="section-spacer" />
        <CopyToClipboard text={props.project.invest_link} onCopy={onCopyText}>
          <div>
            <a
              href={props.project.invest_link}
              target="_blank"
              rel="noreferrer"
            >
              {"Investing link"}
            </a>
            <span className="copy">
              {investingLinkIsCopied ? "copied!" : <MdContentCopy />}
            </span>
          </div>
        </CopyToClipboard>
      </div>
    </div>
  );
};
