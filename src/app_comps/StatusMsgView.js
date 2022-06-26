import { useState } from "react";
import { CopyPasteCompleteText } from "../common_comps/CopyPastText";
import close from "../images/svg/close.svg";
import error from "../images/svg/error.svg";
import success from "../images/svg/success.svg";

export const StatusMsgView = ({ deps }) => {
  const [closing, setClosing] = useState(false);

  const notificationTypeClass = notificationClassName(deps.statusMsgDisplay);

  const onCloseClick = () => {
    setClosing(true);
    setTimeout(() => {
      deps.statusMsg.clear();
    }, 400);
  };

  var classNames = "msg " + notificationTypeClass;
  if (closing) {
    classNames += " msg-close";
  }

  return (
    <div className="msg-container">
      <div className={classNames}>
        <div className="d-flex align-center gap-32">
          {notificationIcon(deps.statusMsgDisplay)}
          {label(deps.statusMsg, deps.statusMsgDisplay)}
        </div>
        {!deps.statusMsgDisplay.hideClose && (
          <button className="msg__close" onClick={() => onCloseClick()}>
            <img src={close} alt="close" />
          </button>
        )}
      </div>
    </div>
  );
};

const notificationIcon = (statusMsgDisplay) => {
  if (statusMsgDisplay.type === "success") {
    return <img className="mr-5" src={success} alt="success" />;
  } else if (statusMsgDisplay.type === "error") {
    return <img className="mr-5" src={error} alt="error" />;
  } else {
    throw Error("Invalid notification type: " + statusMsgDisplay.type);
  }
};

const notificationClassName = (statusMsgDisplay) => {
  if (statusMsgDisplay.type === "success") {
    return "msg__success";
  } else if (statusMsgDisplay.type === "error") {
    return "msg__error";
  } else {
    throw Error("Invalid notification type: " + statusMsgDisplay.type);
  }
};

const label = (statusMsg, statusMsgDisplay) => {
  if (statusMsgDisplay.type === "success") {
    return successLabel(statusMsg, statusMsgDisplay);
  } else if (statusMsgDisplay.type === "error") {
    return errorLabel(statusMsgDisplay);
  } else {
    throw Error("Invalid notification type: " + statusMsgDisplay.type);
  }
};

const successLabel = (statusMsg, statusMsgDisplay) => {
  // For success messages, only displayMsg is set (no need for details like for errors)
  return (
    <CopyPasteCompleteText
      text={statusMsgDisplay.displayMsg}
      copyText={statusMsgDisplay.displayMsg}
      hideIcon={true}
      statusMsg={statusMsg}
    />
  );
};

const errorLabel = (statusMsgDisplay) => {
  // shorten the display message
  // note that this might shorten friendly errors too, though it's not expected (friendly errors should be written such that they fit in a notification)
  let shortMsg = statusMsgDisplay.displayMsg;
  let maxMsgLength = 200;
  if (shortMsg.length > maxMsgLength) {
    shortMsg = shortMsg.substring(0, maxMsgLength) + "...";
  }
  // copy paste, where copy is the complete original message, which may or may not be equal to the displayed message.
  return (
    <CopyPasteCompleteText
      text={shortMsg}
      copyText={statusMsgDisplay.copyMsg}
    />
  );
};

export default StatusMsgView;
