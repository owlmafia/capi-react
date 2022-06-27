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
    console.log("??? calling clear");
    setClosing(true); // starts close animation (changes css class)
    setTimeout(() => {
      console.log("??? removing the msg");
      setStatusMsg(null); // effectively removes the notification

      setTimeout(() => {
        console.log("clearing error class");
        setClosing(false); // clears close animation css class
      }, 100); // a bit after removing the notification, to ensure doesn't re-appear before removal
    }, 350); // note: a bit less than close animation time in css, to ensure removed before it finishes (so it doesn't re-appear)
  },
});
