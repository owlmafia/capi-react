import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { RightCol } from "../right_col/RightCol";
import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { StatusMsgView } from "./StatusMsgView";
import { useParams } from "react-router-dom";
import { init } from "./controller";

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
      await init(params.id, setViewDao, statusMsgUpdater);
    }
    asyncInit();
  }, [params.id, statusMsgUpdater]);

  const sideBar = () => {
    if (isGlobal) {
      return (
        <SideBar
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          myAddressDisplay={myAddressDisplay}
          setMyAddressDisplay={setMyAddressDisplay}
          myBalance={myBalance}
          updateMyBalance={updateMyBalance}
          statusMsgUpdater={statusMsgUpdater}
        />
      );
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
  return (
    <div id="nav_and_main">
      {sideBar()}
      <div id="content">
        {statusMsg && (
          <StatusMsgView
            statusMsgUpdater={statusMsgUpdater}
            statusMsg={statusMsg}
          />
        )}

        {logoView(viewDao?.dao)}
        <Outlet />
      </div>
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
