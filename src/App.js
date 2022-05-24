import React, { useState, useCallback, useEffect, Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import { routesView } from "./app_comps/routes";
import { StatusMsgUpdater } from "./app_comps/StatusMsgUpdater";
import { useWindowSize } from "./common_hooks/useWindowSize";
import {
  updateMyShares,
  updateMyBalance_,
  updateMyDividend_,
  updateDao_,
  initLog,
} from "./controller";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import { updateInvestmentData_, updateFunds_ } from "./shared_functions";

const isIE = /*@cc_on!@*/ false || !!document.documentMode;

const App = () => {
  const [myAddress, setMyAddress] = useState("");

  const [myBalance, setMyBalance] = useState("");

  const [myShares, setMyShares] = useState(null);
  const [myDividend, setMyDividend] = useState(null);
  const [funds, setFunds] = useState(null);
  const [fundsChange, setFundsChange] = useState(null);

  const [myAddressDisplay, setMyAddressDisplay] = useState("");
  const [modal, setModal] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const [investmentData, setInvestmentData] = useState(null);

  const [dao, setDao] = useState(null);

  const [statusMsgUpdater] = useState(StatusMsgUpdater(setStatusMsg));

  const windowSize = useWindowSize();

  const updateMyBalance = useCallback(
    async (myAddress) => {
      if (myAddress) {
        await updateMyBalance_(statusMsgUpdater, myAddress, setMyBalance);
      }
    },
    [statusMsgUpdater]
  );

  useEffect(() => {
    async function asyncInit() {
      await initLog(statusMsgUpdater);
    }
    asyncInit();
  }, [statusMsgUpdater]);

  const updateDao = useCallback(
    async (daoId) => {
      if (daoId) {
        await updateDao_(daoId, setDao, statusMsgUpdater);
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

  const updateInvestmentData = useCallback(
    async (daoId, myAddress) => {
      if (myAddress) {
        await updateInvestmentData_(
          statusMsgUpdater,
          myAddress,
          daoId,
          setInvestmentData
        );
      }
    },
    [statusMsgUpdater]
  );

  const updateMyDividend = useCallback(
    async (daoId, myAddress) => {
      if (myAddress) {
        await updateMyDividend_(
          statusMsgUpdater,
          daoId,
          myAddress,
          setMyDividend
        );
      }
    },
    [statusMsgUpdater]
  );

  const updateFunds = useCallback(
    async (daoId) => {
      await updateFunds_(daoId, setFunds, setFundsChange, statusMsgUpdater);
    },
    [statusMsgUpdater]
  );

  const navigation = () => {
    return (
      <BrowserRouter>
        {routesView({
          myAddress: myAddress,
          setMyAddress: setMyAddress,

          myAddressDisplay: myAddressDisplay,
          setMyAddressDisplay: setMyAddressDisplay,

          setModal: setModal,

          showProgress: (show) => setShowProgress(show),

          statusMsgDisplay: statusMsg,
          statusMsg: statusMsgUpdater,

          myBalance: myBalance,
          updateMyBalance: updateMyBalance,

          myShares: myShares,
          updateMyShares: updateShares,

          myDividend: myDividend,
          updateMyDividend: updateMyDividend,

          investmentData: investmentData,
          updateInvestmentData: updateInvestmentData,

          funds: funds,
          updateFunds: updateFunds,

          fundsChange: fundsChange,

          dao: dao,
          updateDao: updateDao,
        })}
      </BrowserRouter>
    );
  };

  const body = () => {
    return (
      <Fragment>
        {showProgress && <ProgressBar />}
        {/* <div>{connectButton()}</div> */}
        {navigation()}
      </Fragment>
    );
  };

  const desktopView = () => {
    console.log("desktop view, width: %o", windowSize.width);
    return body();
  };

  const mobileView = () => {
    console.log("mobile view, width: %o", windowSize.width);
    return body();
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
          {windowSize.width > 1100 ? desktopView() : mobileView()}
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
