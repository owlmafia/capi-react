import { toFriendlyError } from "./friendlyErrors";

export const StatusMsgUpdater = (setStatusMsg) => ({
  success(msg) {
    msg = msg + "";
    console.log(msg);
    setStatusMsg({ displayMsg: msg, type: "success" });
  },

  error(msg) {
    msg = msg + "";
    var displayMsg = msg;
    try {
      const friendlyMsg = toFriendlyError(msg);
      if (friendlyMsg) {
        msg = friendlyMsg + "\nOriginal error: " + msg;
        displayMsg = friendlyMsg;
      }
    } catch (e) {
      msg += "\n+Error mapping to friendly error: " + (e + "");
    }
    console.error(msg);
    setStatusMsg({ displayMsg: displayMsg, copyMsg: msg, type: "error" });
  },

  clear() {
    setStatusMsg(null);
  },
});
