import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import { ProjectName } from "../ProjectName";

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
                props.project.share_asset_id
              }
              target="_blank"
              rel="noreferrer"
            >
              {props.project.share_asset_id}
            </a>
          </span>
        </p>
        <p>
          <span className="key-val-key">
            {"Vote threshold"}
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
              ?:
            </a>
          </span>
          <span className="key-val-val">{props.project.vote_threshold}</span>
        </p>

        <div className="sectionSpacer" />
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
