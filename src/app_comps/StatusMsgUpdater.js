import { toFriendlyError } from "./friendlyErrors";

export const StatusMsgUpdater = (setStatusMsg) => ({
  // Display text as a success notification
  success(msg) {
    msg = msg + "";
    console.log(msg);
    setStatusMsg({ displayMsg: msg, type: "success" });
  },

  // Displays text as error notification,
  // maps to friendly error for certain regexes
  // allows copy paste
  // if friendly error, the copy paste text corresponds to the original (not friendly) text
  // if not friendly error, the copy paste text is equal to the displayed text
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
