import CopyPasteText from "../common_comps/CopyPastText";

export const StatusMsgView = ({ statusMsgUpdater, statusMsg }) => {
  let shortMsg = statusMsg.displayMsg;
  let maxMsgLength = 200;
  if (shortMsg.length > maxMsgLength) {
    shortMsg = shortMsg.substring(0, maxMsgLength) + "...";
  }

  var className;
  if (statusMsg.type === "success") {
    className = "msg__success";
  } else if (statusMsg.type === "error") {
    className = "msg__error";
  } else {
    throw Error("Invalid status msg type: " + statusMsg.type);
  }

  return (
    <div className={"msg " + className}>
      <CopyPasteText text={shortMsg} copyText={statusMsg.copyMsg} />

      <button className="msg__close" onClick={() => statusMsgUpdater.clear()}>
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.757324 0.757324L9.24261 9.24261" />
          <path d="M0.757395 9.24261L9.24268 0.757324" />
        </svg>
      </button>
    </div>
  );
};

export default StatusMsgView;
