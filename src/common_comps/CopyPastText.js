import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import myalgo from "../images/svg/myalgo.svg";
// import checkmark from "../images/svg/checkmark.svg";

const CopyPasteText = ({ statusMsg, text, copyText: copyTextOpt, copyMsg }) => {
  return (
    <CopyPasteHtml
      element={<div className="ft-color-black ft-weight-500">{text}</div>}
      copyText={copyTextOpt ?? text}
      statusMsg={statusMsg}
      copyMsg={copyMsg}
    />
  );
};

export default CopyPasteText;

export const CopyPasteHtml = ({ statusMsg, element, copyText, copyMsg }) => {
  //   const [isCopied, _setIsCopied] = useState(false);
  const isCopied = false;

  const onCopy = () => {
    if (copyMsg) {
      statusMsg.success(copyMsg, true);
    }
    // setIsCopied(true);
    setTimeout(() => {
      statusMsg.clear();
      //   setIsCopied(false);
    }, 1500);
  };

  return (
    <CopyToClipboard text={copyText} onCopy={onCopy}>
      <div className="copyable d-flex gap-10">
        {element}
        {/* <span className="copy_msg">{isCopied ? "Copied!" : null}</span> */}
        <span className={`copy ${isCopied ? "active" : ""}`}>
          {isCopied ? (
            // <img className="copy_icon" src={checkmark} alt="checkmark" />
            <img className="copy_icon" src={myalgo} alt="myalgo" />
          ) : (
            <img className="copy_icon" src={myalgo} alt="myalgo" />
          )}
        </span>
      </div>
    </CopyToClipboard>
  );
};

export const CopyPasteCompleteText = ({ text, copyText: copyTextOpt }) => {
  return (
    <CopyPasteCompleteHtml
      element={<div className="ft-color-black">{text}</div>}
      copyText={copyTextOpt ?? text}
    />
  );
};

export const CopyPasteCompleteHtml = ({ element, copyText }) => {
  return (
    <CopyToClipboard text={copyText}>
      <div className="copyable d-flex gap-10">
        <span>{element}</span>
      </div>
    </CopyToClipboard>
  );
};
