export const StatusMsgUpdater = (setStatusMsg) => ({
  success(msg) {
    msg = msg + "";
    console.log(msg);
    setStatusMsg({ msg: msg, type: "success" });
  },

  error(msg) {
    msg = msg + "";
    console.error(msg);
    setStatusMsg({ msg: msg, type: "error" });
  },

  clear() {
    setStatusMsg(null);
  },
});
