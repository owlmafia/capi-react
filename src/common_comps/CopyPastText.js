import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import myalgo from "../images/svg/myalgo.svg";
import checkmark from "../images/svg/checkmark.svg";

const CopyPasteText = ({ text, copyText: copyTextOpt }) => {
  return (
    <CopyPasteHtml
      element={<div className="ft-color-black">{text}</div>}
      copyText={copyTextOpt ?? text}
    />
  );
};

export default CopyPasteText;

export const CopyPasteHtml = ({ element, copyText }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <CopyToClipboard text={copyText} onCopy={onCopy}>
      <div className="copyable d-flex gap-10">
        {element}
        {/* <span className="copy_msg">{isCopied ? "Copied!" : null}</span> */}
        <span className={`copy ${isCopied ? "active" : ""}`}>
          {isCopied ? (
            <img className="copy_icon" src={checkmark} alt="checkmark" />
          ) : (
            <img className="copy_icon" src={myalgo} alt="myalgo" />
          )}
        </span>
      </div>
    </CopyToClipboard>
  );
};
