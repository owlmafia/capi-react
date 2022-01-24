import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { Outlet } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";

export const Wireframe = ({
  isGlobal,
  statusMsg,
  onCopyErrorMsg,
  errorMsgIsCopied,
}) => {
  const sideBar = () => {
    if (isGlobal) {
      return <SideBar />;
    } else {
      return <SideBarDao />;
    }
  };
  return (
    <div id="nav_and_main">
      {sideBar()}
      <div id="wrapper">
        {statusMsgView(statusMsg, onCopyErrorMsg, errorMsgIsCopied)}
        <Outlet />
      </div>
    </div>
  );
};

const statusMsgView = (statusMsg, onCopyErrorMsg, errorMsgIsCopied) => {
  if (statusMsg) {
    let shortMsg = statusMsg.msg;
    let maxMsgLength = 200;
    if (shortMsg.length > maxMsgLength) {
      shortMsg = shortMsg.substring(0, maxMsgLength) + "...";
    }

    if (statusMsg.type === "success") {
      return <div className="success">{statusMsg.msg}</div>;
    } else if (statusMsg.type === "error") {
      return (
        <div className="error">
          <CopyToClipboard text={statusMsg.msg} onCopy={onCopyErrorMsg}>
            <div>
              {shortMsg}
              <span className="copy">
                {errorMsgIsCopied ? "copied!" : <MdContentCopy />}
              </span>
            </div>
          </CopyToClipboard>
        </div>
      );
    } else {
      throw Error("Invalid status msg type: " + statusMsg.type);
    }
  } else {
    return null;
  }
};
