import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { DaoTop } from "./DaoTop";
import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { StatusMsgView } from "./StatusMsgView";
import share from "../images/svg/share.svg";
import logo from "../images/logo.svg";
import { MobileWalletView } from "../right_col/MobileWalletView";

export const WireframeMobile = ({ isGlobal, deps, dao }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const sideBar = () => {
    if (isGlobal) {
      return <SideBar />;
    } else {
      return <SideBarDao deps={deps} />;
    }
  };

  const daoTop = () => {
    return !isGlobal && dao && <DaoTop dao={dao} />;
  };

  return (
    <>
      <div className="mob_nav_bar">
        <Link to="#">
          {/* replace with bars icon */}
          <img
            src={share}
            alt="nav_bars"
            onClick={() => setShowSidebar(!showSidebar)}
          />
          <div className="logo-container">
            <img src={logo} alt="logo" />
          </div>
          {/* replace with wallet icon */}
          <img
            src={share}
            alt="wallet"
            onClick={() => setShowWallet(!showWallet)}
          />
        </Link>
      </div>
      {showSidebar && sideBar()}
      {showWallet && <MobileWalletView deps={deps} />}
      <div id="content">
        {deps.statusMsgDisplay && <StatusMsgView deps={deps} />}
        {daoTop()}
        <Outlet />
      </div>
    </>
  );
};
