import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import { routesView } from "./app_comps/routes";
import { updateMyShares } from "./controller";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import { StatusMsgUpdater } from "./StatusMsgUpdater";

const isIE = /*@cc_on!@*/ false || !!document.documentMode;

const App = () => {
  const [myAddress, setMyAddress] = useState("");

  const [myBalance, setMyBalance] = useState("");
  const [myShares, setMyShares] = useState(null);

  const [myAddressDisplay, setMyAddressDisplay] = useState("");
  const [modal, setModal] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsgIsCopied, setErrorMsgIsCopied] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const [statusMsgUpdater, _] = useState(StatusMsgUpdater(setStatusMsg));

  const updateShares = async (projectId, myAddress) => {
    if (myAddress) {
      await updateMyShares(statusMsgUpdater, projectId, myAddress, setMyShares);
    }
  };

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
              setMyAddressDisplay,
              myShares,
              updateShares
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
