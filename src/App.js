import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import React, { useState } from "react";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import { routesView } from "./app_comps/routes";

const isIE = /*@cc_on!@*/ false || !!document.documentMode;

const App = () => {
  const [myAddress, setMyAddress] = useState("");
  const [myBalance, setMyBalance] = useState("");
  const [myAddressDisplay, setMyAddressDisplay] = useState("");
  const [modal, setModal] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsgIsCopied, setErrorMsgIsCopied] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  class StatusMsgUpdater {
    success(msg) {
      msg = msg + "";
      console.log(msg);
      setStatusMsg({ msg: msg, type: "success" });
    }
    error(msg) {
      msg = msg + "";
      console.error(msg);
      setStatusMsg({ msg: msg, type: "error" });
    }
    clear() {
      setStatusMsg(null);
    }
  }

  const [statusMsgUpdater, _] = useState(new StatusMsgUpdater());

  const onCopyErrorMsg = () => {
    setErrorMsgIsCopied(true);
    setTimeout(() => {
      setErrorMsgIsCopied(false);
    }, 1000);
  };

  if (isIE) {
    return (
      <div style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}>
        {"Internet Explorer is not supported."}
      </div>
    );
  } else {
    return (
      <div>
        <div id="container">
          {showProgress && <ProgressBar />}
          {/* <div>{connectButton()}</div> */}

          <BrowserRouter>
            {routesView(
              myAddress,
              setMyAddress,
              setModal,
              setShowProgress,
              statusMsgUpdater,
              setMyBalance,
              myAddressDisplay,
              myBalance,
              statusMsg,
              onCopyErrorMsg,
              errorMsgIsCopied,
              setMyAddressDisplay
            )}
          </BrowserRouter>
          {modal && (
            <Modal title={modal.title} onCloseClick={() => setModal(null)}>
              {modal.body}
            </Modal>
          )}
        </div>
      </div>
    );
  }
};

export default App;
