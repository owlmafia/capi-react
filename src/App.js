import React, { useState, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import { routesView } from "./app_comps/routes";
import { StatusMsgUpdater } from "./app_comps/StatusMsgUpdater";
import { updateMyShares, updateMyBalance_ } from "./controller";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";

const isIE = /*@cc_on!@*/ false || !!document.documentMode;

const App = () => {
  const [myAddress, setMyAddress] = useState("");

  const [myBalance, setMyBalance] = useState("");
  const [myShares, setMyShares] = useState(null);

  const [myAddressDisplay, setMyAddressDisplay] = useState("");
  const [modal, setModal] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const [statusMsgUpdater] = useState(StatusMsgUpdater(setStatusMsg));

  const updateMyBalance = useCallback(
    async (myAddress) => {
      if (myAddress) {
        await updateMyBalance_(statusMsgUpdater, myAddress, setMyBalance);
      }
    },
    [statusMsgUpdater]
  );

  const updateShares = useCallback(
    async (daoId, myAddress) => {
      if (myAddress) {
        await updateMyShares(statusMsgUpdater, daoId, myAddress, setMyShares);
      }
    },
    [statusMsgUpdater]
  );

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
              updateMyBalance,
              myAddressDisplay,
              myBalance,
              statusMsg,
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
