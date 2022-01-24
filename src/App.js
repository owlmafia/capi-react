import "./App.scss";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useParams,
  Outlet,
} from "react-router-dom";
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
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
} from "react-pro-sidebar";
import { FaGem, FaHeart, FaAddressBook, FaAnchor } from "react-icons/fa";
import { Stats } from "./stats/Stats";

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
            {routesView(
              myAddress,
              setModal,
              setShowProgress,
              statusMsgUpdater,
              setMyBalance,
              myAddressDisplay,
              myBalance,

              statusMsg,
              onCopyErrorMsg,
              errorMsgIsCopied
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

export const Wireframe = ({
  isGlobal,
  statusMsg,
  onCopyErrorMsg,
  errorMsgIsCopied,
}) => {
  const sideBar = () => {
    if (isGlobal) {
      return <SideBar />;
    } else {
      return <SideBarDao />;
    }
  };
  return (
    <div id="nav_and_main">
      {sideBar()}
      <div id="wrapper">
        {statusMsgView(statusMsg, onCopyErrorMsg, errorMsgIsCopied)}
        <Outlet />
      </div>
    </div>
  );
};

const yourAddressView = (myAddress, myAddressDisplay, myBalance) => {
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

export const OuterWireframe = ({ myAddress, myAddressDisplay, myBalance }) => {
  return (
    <div>
      {yourAddressView(myAddress, myAddressDisplay, myBalance)}
      <Outlet />
    </div>
  );
};

const routesView = (
  myAddress,
  setModal,
  setShowProgress,
  statusMsgUpdater,
  setMyBalance,
  myAddressDisplay,
  myBalance,

  statusMsg,
  onCopyErrorMsg,
  errorMsgIsCopied
) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <OuterWireframe
            myAddress={myAddress}
            myAddressDisplay={myAddressDisplay}
            myBalance={myBalance}
          />
        }
      >
        <Route
          path="global"
          element={
            <Wireframe
              isGlobal={true}
              statusMsg={statusMsg}
              onCopyErrorMsg={onCopyErrorMsg}
              errorMsgIsCopied={errorMsgIsCopied}
            />
          }
        >
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
            path="my_projects"
            element={<div>{"hellooooo my projects todo"}</div>}
          />
        </Route>
        <Route
          path=":id"
          element={
            <Wireframe
              isGlobal={false}
              statusMsg={statusMsg}
              onCopyErrorMsg={onCopyErrorMsg}
              errorMsgIsCopied={errorMsgIsCopied}
            />
          }
        >
          <Route
            index
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
            path="invest"
            element={
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
            path="investment"
            element={
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
            path="withdraw"
            element={
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
            path="withdrawal_history"
            element={
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
            path="roadmap"
            element={
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
            path="roadmap/add"
            element={
              <AddRoadmapItem
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
          <Route
            exact
            path="stats"
            element={
              <Stats
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
              />
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
};

const statusMsgView = (statusMsg, onCopyErrorMsg, errorMsgIsCopied) => {
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

export const SideBar = (props) => {
  let params = useParams();

  return (
    <ProSidebar>
      <SidebarHeader>
        <div
          style={{
            height: "80px",
            padding: "50px 20px 50px 20px",
          }}
        >
          <div
            style={{
              backgroundColor: "red",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<FaGem />}>
            <Link to="create">Create</Link>
          </MenuItem>
          <MenuItem icon={<FaHeart />}>
            <Link to="my_projects">My projects</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export const SideBarDao = ({ projectId }) => {
  let params = useParams();

  return (
    <ProSidebar>
      <SidebarHeader>
        <div
          style={{
            height: "80px",
            padding: "50px 20px 50px 20px",
          }}
        >
          <div
            style={{
              backgroundColor: "blue",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<FaAddressBook />}>
            <Link to="">Home</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="roadmap">Roadmap</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="stats">Stats</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="investment">My investment</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="withdraw">Withdraw</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="withdrawal_history">Funds activity</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};
