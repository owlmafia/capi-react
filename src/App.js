import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./Home";
import { CreateProject } from "./CreateProject";
import { Invest } from "./Invest";
import { Project } from "./Project";
import React, { useState } from "react";
import { connectWallet } from "./MyAlgo";
import { Investment } from "./Investment";
import { Withdrawal } from "./Withdraw";
import { Vote } from "./Vote";
import { NotFound } from "./NotFound";
import Modal from "./Modal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { MdContentCopy } from "react-icons/md";

const isIE = /*@cc_on!@*/ false || !!document.documentMode;

const App = () => {
  const [myAddress, setMyAddress] = useState("");
  const [myAddressDisplay, setMyAddressDisplay] = useState("");
  const [modal, setModal] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsgIsCopied, setErrorMsgIsCopied] = useState(false);

  class StatusMsgUpdater {
    constructor() {}
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
  }

  const onCopyErrorMsg = () => {
    setErrorMsgIsCopied(true);
    setTimeout(() => {
      setErrorMsgIsCopied(false);
    }, 1000);
  };

  const statusMsgUpdater = new StatusMsgUpdater();

  const connectButtonElement = () => {
    if (myAddress === "") {
      return (
        <button
          className="connect-button"
          onClick={async (event) => {
            try {
              let address = await connectWallet();
              setMyAddress(address);

              const short_chars = 3;
              const leading = address.substring(0, short_chars);
              const trailing = address.substring(address.length - short_chars);
              const shortAddress = leading + "..." + trailing;
              setMyAddressDisplay(shortAddress);
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
          className="connect-button"
          onClick={() => {
            setMyAddress("");
          }}
        >
          {"Disconnect"}
        </button>
      );
    }
  };

  const yourAddressElement = () => {
    if (myAddress !== "") {
      return (
        <div>
          <div>{"Your address:"}</div>
          <div className="your-address">
            <a
              href={"https://testnet.algoexplorer.io/address/" + myAddress}
              target="_blank"
            >
              {myAddressDisplay}
            </a>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const statusMsgElement = () => {
    if (statusMsg) {
      var className = "";
      if (statusMsg.type === "success") {
        return <div className="success">{statusMsg.msg}</div>;
      } else if (statusMsg.type === "error") {
        return (
          <div className="error">
            <CopyToClipboard text={statusMsg.msg} onCopy={onCopyErrorMsg}>
              <div>
                {statusMsg.msg}
                <span className="copy">
                  {errorMsgIsCopied ? "copied!" : <MdContentCopy />}
                </span>
              </div>
            </CopyToClipboard>
          </div>
        );
      } else {
        throw "Invalid status msg type: " + statusMsg.type;
      }
    } else {
      return null;
    }
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
          {connectButtonElement()}
          {yourAddressElement()}
          <Router>
            <div id="wrapper">
              {statusMsgElement()}

              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/create">
                  <CreateProject
                    myAddress={myAddress}
                    showModal={(modal) => setModal(modal)}
                    statusMsg={statusMsgUpdater}
                  />
                </Route>
                <Route
                  exact
                  path="/project/:id"
                  render={(routeProps) => (
                    <Project
                      {...routeProps}
                      myAddress={myAddress}
                      showModal={(modal) => setModal(modal)}
                      statusMsg={statusMsgUpdater}
                    />
                  )}
                />
                <Route
                  exact
                  path="/invest/:id"
                  render={(routeProps) => (
                    <Invest
                      {...routeProps}
                      myAddress={myAddress}
                      showModal={(modal) => setModal(modal)}
                      statusMsg={statusMsgUpdater}
                    />
                  )}
                />
                <Route
                  exact
                  path="/investment/:id"
                  render={(routeProps) => (
                    <Investment
                      {...routeProps}
                      myAddress={myAddress}
                      statusMsg={statusMsgUpdater}
                    />
                  )}
                />
                <Route
                  exact
                  path="/withdraw/:id"
                  render={(routeProps) => (
                    <Withdrawal
                      {...routeProps}
                      myAddress={myAddress}
                      statusMsg={statusMsgUpdater}
                    />
                  )}
                />
                <Route
                  exact
                  path="/vote/:id"
                  render={(routeProps) => (
                    <Vote
                      {...routeProps}
                      myAddress={myAddress}
                      statusMsg={statusMsgUpdater}
                    />
                  )}
                />

                <Route path="*">
                  <NotFound />
                </Route>
              </Switch>
            </div>
          </Router>
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
