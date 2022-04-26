import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { RightCol } from "../right_col/RightCol";
import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { StatusMsgView } from "./StatusMsgView";
import { useParams } from "react-router-dom";
import { init, initWithDaoId } from "./controller";
import { RightDaoCol } from "../right_col/RightDaoCol";
import logo from '../images/logo.svg';

export const Wireframe = ({
  isGlobal,
  statusMsg,

  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,

  myShares,
  updateMyShares,
}) => {
  let params = useParams();
  const [viewDao, setViewDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await initWithDaoId(params.id, setViewDao, statusMsgUpdater);
      } else {
        await init(params.id, setViewDao, statusMsgUpdater);
      }
    }
    asyncInit();
  }, [params.id, statusMsgUpdater]);

  const sideBar = () => {
    if (isGlobal) {
      return <SideBar />;
    } else {
      return (
        <SideBarDao
          myAddress={myAddress}
          statusMsgUpdater={statusMsgUpdater}
          myShares={myShares}
          updateMyShares={updateMyShares}
        />
      );
    }
  };

  const rightCol = () => {
    if (isGlobal) {
      //   return null;
      return (
        <RightCol
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          myAddressDisplay={myAddressDisplay}
          setMyAddressDisplay={setMyAddressDisplay}
          myBalance={myBalance}
          updateMyBalance={updateMyBalance}
          statusMsgUpdater={statusMsgUpdater}
          myShares={myShares}
          updateMyShares={updateMyShares}
        />
      );
    } else {
      return (
        <RightDaoCol
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          myAddressDisplay={myAddressDisplay}
          setMyAddressDisplay={setMyAddressDisplay}
          myBalance={myBalance}
          updateMyBalance={updateMyBalance}
          statusMsgUpdater={statusMsgUpdater}
          myShares={myShares}
          updateMyShares={updateMyShares}
        />
      );
    }
  };

  return (
    <div id="nav_and_main">
      <div className="logo-container">
        <img src={logo} alt="logo"/>
      </div>
      {sideBar()}
      <div id="content">
        <div className="content-img"></div>
        {statusMsg && (
          <StatusMsgView
            statusMsgUpdater={statusMsgUpdater}
            statusMsg={statusMsg}
          />
        )}

        {logoView(viewDao?.dao)}
        <Outlet />
      </div>
      {rightCol()}
    </div>
  );
};

const logoView = (dao) => {
  if (dao?.logo_url) {
    return (
      <img id="banner_img" src={dao?.logo_url ?? ""} alt="Project image" />
    );
  } else {
    return null;
  }
};
