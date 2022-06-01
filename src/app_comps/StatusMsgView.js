import CopyPasteText from "../common_comps/CopyPastText";
import close from "../images/svg/close.svg";
import error from "../images/svg/error.svg";
import success from "../images/svg/success.svg";

export const StatusMsgView = ({ deps }) => {
  const className = notificationClassName(deps.statusMsgDisplay);

  return (
    <div className={"msg " + className}>
      <div className="d-flex align-center gap-32">
        {notificationIcon(deps.statusMsgDisplay)}
        {label(deps.statusMsgDisplay)}
      </div>
      <button className="msg__close" onClick={() => deps.statusMsg.clear()}>
        <img src={close} alt="close" />
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.757324 0.757324L9.24261 9.24261" />
          <path d="M0.757395 9.24261L9.24268 0.757324" />
        </svg>
      </button>
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

const label = (statusMsgDisplay) => {
  if (statusMsgDisplay.type === "success") {
    return successLabel(statusMsgDisplay);
  } else if (statusMsgDisplay.type === "error") {
    return errorLabel(statusMsgDisplay);
  } else {
    throw Error("Invalid notification type: " + statusMsgDisplay.type);
  }
};

const successLabel = (statusMsgDisplay) => {
  // For success messages, only displayMsg is set (no need for details like for errors)
  // it also doesn't have copy paste, as it's not needed for a success message.
  return <div>{statusMsgDisplay.displayMsg}</div>;
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
  return <CopyPasteText text={shortMsg} copyText={statusMsgDisplay.copyMsg} />;
};

export default StatusMsgView;
