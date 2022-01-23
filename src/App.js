import "./App.scss";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { CreateProject } from "./create/CreateProject";
import { Invest } from "./invest/Invest";
import { Project } from "./project/Project";
import React, { useState } from "react";
import { connectWallet } from "./MyAlgo";
import { Investment } from "./investment/Investment";
import { Withdrawal } from "./withdraw/Withdraw";
import { NotFound } from "./NotFound";
import Modal from "./Modal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";
import ProgressBar from "./ProgressBar";
import { WithdrawalHistory } from "./withdrawal_history/WithdrawalHistory";
import { Roadmap } from "./roadmap/Roadmap";
import { AddRoadmapItem } from "./roadmap/AddRoadmapItem";

const isIE = /*@cc_on!@*/ false || !!document.documentMode;

const wasmPromise = import("wasm");

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

  const connectButton = () => {
    if (myAddress === "") {
      return (
        <button
          className="connect-button"
          onClick={async (event) => {
            try {
              const { bridge_balance } = await wasmPromise;

              let address = await connectWallet();
              setMyAddress(address);

              const short_chars = 3;
              const leading = address.substring(0, short_chars);
              const trailing = address.substring(address.length - short_chars);
              const shortAddress = leading + "..." + trailing;
              setMyAddressDisplay(shortAddress);

              const balance = await bridge_balance({ address: address });
              setMyBalance(balance.balance);
            } catch (e) {
              statusMsgUpdater.error(e);
            }
          }}
        >
          {"Connect My Algo wallet"}
        </button>
      );
    } else {
      return (
        <button
          className="disconnect-button"
          onClick={() => {
            setMyAddress("");
          }}
        >
          {"Disconnect"}
        </button>
      );
    }
  };

  const yourAddressView = () => {
    if (myAddress !== "") {
      return (
        <div id="user-data">
          {/* <div>{"Your address:"}</div> */}
          <div className="your-address">
            <a
              href={"https://testnet.algoexplorer.io/address/" + myAddress}
              target="_blank"
              rel="noreferrer"
            >
              {myAddressDisplay}
            </a>
          </div>
          <div id="my-balance">{myBalance}</div>
        </div>
      );
    } else {
      return null;
    }
  };

  const statusMsgView = () => {
    if (statusMsg) {
      let shortMsg = statusMsg.msg;
      let maxMsgLength = 200;
      if (shortMsg.length > maxMsgLength) {
        shortMsg = shortMsg.substring(0, maxMsgLength) + "...";
      }

      if (statusMsg.type === "success") {
        return <div className="success">{statusMsg.msg}</div>;
      } else if (statusMsg.type === "error") {
        return (
          <div className="error">
            <CopyToClipboard text={statusMsg.msg} onCopy={onCopyErrorMsg}>
              <div>
                {shortMsg}
                <span className="copy">
                  {errorMsgIsCopied ? "copied!" : <MdContentCopy />}
                </span>
              </div>
            </CopyToClipboard>
          </div>
        );
      } else {
        throw Error("Invalid status msg type: " + statusMsg.type);
      }
    } else {
      return null;
    }
  };

  const routesView = () => {
    return (
      <Routes>
        {/* <Route exact path="/" component={Home} /> */}
        <Route
          path="create"
          element={
            <CreateProject
              myAddress={myAddress}
              showModal={(modal) => setModal(modal)}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
              setMyBalance={setMyBalance}
            />
          }
        />
        <Route
          exact
          path="/project/:id"
          element={
            <Project
              myAddress={myAddress}
              showModal={(modal) => setModal(modal)}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
            />
          }
        />
        <Route
          exact
          path="/invest/:id"
          render={
            <Invest
              myAddress={myAddress}
              showModal={(modal) => setModal(modal)}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
              setMyBalance={setMyBalance}
            />
          }
        />
        <Route
          exact
          path="/investment/:id"
          render={
            <Investment
              myAddress={myAddress}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
              setMyBalance={setMyBalance}
            />
          }
        />
        <Route
          exact
          path="/withdraw/:id"
          render={
            <Withdrawal
              myAddress={myAddress}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
              setMyBalance={setMyBalance}
            />
          }
        />
        <Route
          exact
          path="/withdrawal_history/:id"
          render={
            <WithdrawalHistory
              myAddress={myAddress}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
              setMyBalance={setMyBalance}
            />
          }
        />
        <Route
          exact
          path="/roadmap/:id"
          render={
            <Roadmap
              myAddress={myAddress}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
              setMyBalance={setMyBalance}
            />
          }
        />
        <Route
          exact
          path="/roadmap/add/:id"
          render={
            <AddRoadmapItem
              myAddress={myAddress}
              showProgress={(show) => setShowProgress(show)}
              statusMsg={statusMsgUpdater}
              setMyBalance={setMyBalance}
            />
          }
        />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
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
        <div className="container">
          {showProgress && <ProgressBar />}
          <div>{connectButton()}</div>

          <BrowserRouter>
            {yourAddressView()}
            <nav
              style={{
                borderBottom: "solid 1px",
                paddingBottom: "1rem",
              }}
            >
              <Link to="/create">Create</Link> |{" "}
              <Link to="/my_projects">My projects</Link>
            </nav>
            <div id="wrapper">
              {statusMsgView()}
              {routesView()}
            </div>
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
