import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";

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
        <p>{"Project name:"}</p>
        <a href={props.project.project_link} target="_blank">
          {props.project.name}
        </a>
        <p>{"Share supply:"}</p>
        {props.project.share_supply}
        <p>{"Share asset id:"}</p>
        <a
          href={
            "https://testnet.algoexplorer.io/asset/" +
            props.project.share_asset_id
          }
          target="_blank"
        >
          {props.project.share_asset_id}
        </a>
        <p>{"Share price per unit:"}</p>
        {props.project.share_price}
        <p>
          {"Vote threshold:"}
          <a
            href="#"
            onClick={() =>
              props.showModal({
                title: "Vote threshold",
                body: (
                  <div>
                    <p>
                      {
                        "Votes % (relative to total share supply) required to withdraw funds."
                      }
                    </p>
                  </div>
                ),
              })
            }
          >
            ?
          </a>
        </p>
        {props.project.vote_threshold}
        <br />
        <CopyToClipboard text={props.project.invest_link} onCopy={onCopyText}>
          <div>
            <a href={props.project.invest_link} target="_blank">
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
