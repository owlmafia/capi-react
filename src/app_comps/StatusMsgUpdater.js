import { toFriendlyError } from "./friendlyErrors";

export const StatusMsgUpdater = (setStatusMsg, setClosing) => ({
  // Display text as a success notification
  success(msg, hideClose) {
    msg = msg + "";
    console.log(msg);
    setStatusMsg({ displayMsg: msg, type: "success", hideClose: hideClose });
  },

  // Displays text as error notification,
  // maps to friendly error for certain regexes
  // allows copy paste
  // if friendly error, the copy paste text corresponds to the original (not friendly) text
  // if not friendly error, the copy paste text is equal to the displayed text
  error(msg, hideClose) {
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
    console.error("Error notification: %o", msg);
    setStatusMsg({
      displayMsg: displayMsg,
      copyMsg: msg,
      type: "error",
      hideClose: hideClose,
    });
  },

  clear() {
    setClosing(true); // starts close animation (changes css class)
    setTimeout(() => {
      setStatusMsg(null); // effectively removes the notification
      setClosing(false); // clears close animation css class
    }, 400); // note: same time as close animation in css
  },
});
