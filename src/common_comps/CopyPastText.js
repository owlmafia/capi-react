import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyPasteText = ({ text, copyText: copyTextOpt }) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyText = copyTextOpt ?? text;

  const onCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <CopyToClipboard text={copyText} onCopy={onCopy}>
      <div className="copyable">
        <div className="copyable__text">{text}</div>
        <span className="copy_msg">{isCopied ? "Copied!" : null}</span>
      </div>
    </CopyToClipboard>
  );
};

export default CopyPasteText;
