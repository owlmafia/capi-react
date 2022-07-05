import React, { useState, useCallback, useEffect, Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { routesView } from "./app_comps/routes";
import { StatusMsgUpdater } from "./app_comps/StatusMsgUpdater";
import { checkForUpdates } from "./common_functions/common";
import { useWindowSize } from "./common_hooks/useWindowSize";
import {
  updateMyShares,
  updateMyBalance_,
  updateMyDividend_,
  updateDao_,
  initLog,
} from "./controller";
import Modal from "./modal/Modal";
import {
  updateInvestmentData_,
  updateFunds_,
  shortedAddress,
} from "./shared_functions";
import OpenWalletModal from "./wallet/OpenWalletModal";
import { initWcWalletIfAvailable } from "./wallet/walletConnectWallet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

const isIE = /*@cc_on!@*/ false || !!document.documentMode;

const App = () => {
  const [myAddress, setMyAddress] = useState("");

  const [myBalance, setMyBalance] = useState("");

  const [myShares, setMyShares] = useState(null);
  const [myDividend, setMyDividend] = useState(null);
  const [funds, setFunds] = useState(null);
  const [fundsChange, setFundsChange] = useState(null);
  const [daoVersion, setDaoVersion] = useState(null);

  const [myAddressDisplay, setMyAddressDisplay] = useState("");
  const [modal, setModal] = useState(null);
  const [_, setStatusMsg] = useState(null);

  const [investmentData, setInvestmentData] = useState(null);

  const [dao, setDao] = useState(null);

  const [statusMsgUpdater] = useState(StatusMsgUpdater(setStatusMsg));

  const windowSize = useWindowSize();

  const [wallet, setWallet] = useState(null);

  // this is only used when the selected wallet is wallet connect
  const [wcShowOpenWalletModal, setWcShowOpenWalletModal] = useState(false);

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

  useEffect(() => {
    initWcWalletIfAvailable(
      statusMsgUpdater,
      setMyAddress,
      setWallet,
      setWcShowOpenWalletModal
    );
  }, [statusMsgUpdater]);

  useEffect(() => {
    async function nestedAsync() {
      if (myAddress) {
        setMyAddressDisplay(shortedAddress(myAddress));
        await updateMyBalance(myAddress);
      }
    }
    nestedAsync();
  }, [myAddress, updateMyBalance]);

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

  const updateDaoVersion = useCallback(
    async (daoId) => {
      await checkForUpdates(statusMsgUpdater, daoId, setDaoVersion);
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

          daoVersion: daoVersion,
          updateDaoVersion: updateDaoVersion,

          wallet: wallet,
          setWallet: setWallet,

          setWcShowOpenWalletModal: setWcShowOpenWalletModal,

          size: windowSizeClasses(windowSize),
        })}
      </BrowserRouter>
    );
  };

  const body = () => {
    return (
      <Fragment>
        {/* <div>{connectButton()}</div> */}
        {navigation()}
      </Fragment>
    );
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
          {body()}
          {modal && (
            <Modal title={modal.title} onCloseClick={() => setModal(null)}>
              {modal.body}
            </Modal>
          )}
          {wcShowOpenWalletModal && (
            <OpenWalletModal setShowModal={setWcShowOpenWalletModal} />
          )}
          <ToastContainer />
        </div>
      </div>
    );
  }
};

export default App;

const SIZE_TABLET_THRESHOLD = 1330;
const SIZE_PHONE_THRESHOLD = 600;

// returns an object with all size classes, where at least one is expected to be true
// we use abstract identifiers like "s1", to accomodate possible new cases (phone-landscape, tablet with certain aspect ratio etc.) while keeping naming simple
const windowSizeClasses = (windowSize) => {
  const windowWidth = windowSize.width;
  console.log("Window width updated: " + windowWidth);

  // Note: tablet and phone here implies portrait mode. Landscape hasn't been explicitly designed for or tested yet.
  const isTablet =
    windowWidth <= SIZE_TABLET_THRESHOLD && windowWidth > SIZE_PHONE_THRESHOLD;
  const isPhone = windowWidth <= SIZE_PHONE_THRESHOLD;

  return {
    s1: windowWidth > SIZE_TABLET_THRESHOLD, // desktop
    s2: isTablet,
    s3: isPhone,
    s4: isTablet || isPhone, // convenience size, so caller doesn't have to keep writing this
  };
};
