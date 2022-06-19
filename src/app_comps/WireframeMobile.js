import React, { useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { DaoTop } from "./DaoTop";
import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { StatusMsgView } from "./StatusMsgView";
import menu from "../images/svg/menu.svg";
import logo from "../images/logo.svg";
import { MobileWalletView } from "../right_col/MobileWalletView";
import wallet from "../images/svg/account.svg";

export const WireframeMobile = ({ isGlobal, deps, dao }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const sideMenuClass = useMemo(() => {
    if (showSidebar) {
      return "sidebar-container";
    } else {
      return "sidebar-container sidebar-container-closing";
    }
  }, [showSidebar]);

  const rightColClass = useMemo(() => {
    if (showWallet) {
      return "rightcol";
    } else {
      return "rightcol-closing";
    }
  }, [showWallet]);

  const sideBar = () => {
    if (isGlobal) {
      return <SideBar containerClass={sideMenuClass} />;
    } else {
      return <SideBarDao deps={deps} containerClass={sideMenuClass} />;
    }
  };

  const daoTop = () => {
    return !isGlobal && dao && <DaoTop dao={dao} />;
  };

  const showOverlay = showSidebar || showWallet;

  return (
    <>
      <MobNavBar
        setShowSidebar={setShowSidebar}
        setShowWallet={setShowWallet}
      />
      {/* now it's always shown */}
      {/* {showSidebar && sideBar()} */}
      {sideBar()}
      {showOverlay && (
        <ContentOverlay
          setShowSidebar={setShowSidebar}
          setShowWallet={setShowWallet}
        />
      )}
      <MobileWalletView
        deps={deps}
        containerClass={rightColClass}
        onClose={() => setShowWallet(false)}
      />
      <div id="content">
        {deps.statusMsgDisplay && <StatusMsgView deps={deps} />}
        {daoTop()}
        <Outlet />
      </div>
    </>
  );
};

const ContentOverlay = ({ setShowSidebar, setShowWallet }) => {
  return (
    <div
      id="mob_nav_bar_overlay"
      onClick={() => {
        setShowSidebar(false);
        setShowWallet(false);
      }}
    />
  );
};

const MobNavBar = ({ setShowSidebar, setShowWallet }) => {
  return (
    <div className="mob_nav_bar">
      <Link to="#">
        <img
          src={menu}
          alt="nav_bars"
          onClick={() => setShowSidebar((s) => !s)}
        />
        <div className="logo-container">
          <img src={logo} alt="logo" />
        </div>
        <img
          src={wallet}
          alt="wallet"
          onClick={() => setShowWallet((s) => !s)}
        />
      </Link>
    </div>
  );
};
