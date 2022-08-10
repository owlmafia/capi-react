import { toFriendlyError } from "./friendlyErrors";
import { toast } from "react-toastify";

export const StatusMsgUpdater = (setStatusMsg) => ({
  // Display text as a success notification
  success(msg, hideClose) {
    msg = msg + "";
    console.log(msg);
    toast(msg, {
      toastId: msg,
      type: toast.TYPE.SUCCESS,
      closeOnClick: false,
      position: toast.POSITION.TOP_CENTER,
    });
  },

  // Displays text as error notification,
  // maps to friendly error for certain regexes
  // allows copy paste
  // if friendly error, the copy paste text corresponds to the original (not friendly) text
  // if not friendly error, the copy paste text is equal to the displayed text
  error(msg, hideClose) {
    // special handling for error instances - they're objects, but JSON.stringify and JSON.parse don't work
    if (msg.message) {
      msg = msg.message;
    }
    if (typeof msg === "object") {
      msg = JSON.stringify(msg);
    }

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
    // NOTE that for now msg (which contains the full original error message) isn't included in the notification
    // if user wants to send a report, they've to copy paste from the console
    toast(displayMsg, {
      toastId: displayMsg,
      type: toast.TYPE.ERROR,
      closeOnClick: false,
      position: toast.POSITION.TOP_CENTER,
    });
  },

  clear() {
    // quick fix for "project created" toast disappearing quickly
    // TODO probably delete clear() - with timed notifications seems not neded anymore
    // toast.dismiss();
  },
});
