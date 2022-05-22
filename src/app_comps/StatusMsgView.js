import CopyPasteText from "../common_comps/CopyPastText";
import close from "../images/svg/close.svg";
import error from "../images/svg/error.svg";
import success from "../images/svg/success.svg";

export const StatusMsgView = ({ deps }) => {
  let shortMsg = deps.statusMsgDisplay.displayMsg;
  let maxMsgLength = 200;
  if (shortMsg.length > maxMsgLength) {
    shortMsg = shortMsg.substring(0, maxMsgLength) + "...";
  }

  var className;
  if (deps.statusMsgDisplay.type === "success") {
    className = "msg__success";
  } else if (deps.statusMsgDisplay.type === "error") {
    className = "msg__error";
  } else {
    throw Error("Invalid status msg type: " + deps.statusMsgDisplay.type);
  }

  return (
    <div className={"msg " + className}>
      <div className="d-flex align-center gap-32">
        {deps.statusMsgDisplay.type === "error" ? <img className="mr-5" src={error} alt="error" /> : ""}
        {deps.statusMsgDisplay.type === "success" ? <img className="mr-5" src={success} alt="success" /> : ""}
        <CopyPasteText text={shortMsg} copyText={deps.statusMsgDisplay.copyMsg} />
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

export default StatusMsgView;
