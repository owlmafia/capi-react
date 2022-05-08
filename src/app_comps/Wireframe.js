import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import logo from "../images/logo.svg";
import { RightCol } from "../right_col/RightCol";
import { RightDaoCol } from "../right_col/RightDaoCol";
import { init, initWithDaoId } from "./controller";
import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { StatusMsgView } from "./StatusMsgView";

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
  myDividend,
  updateMyDividend,
  showProgress,
  updateInvestmentData,
  funds,
  updateFunds,
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
          updateMyShares={updateMyShares}
          myDividend={myDividend}
          updateMyDividend={updateMyDividend}
          showProgress={showProgress}
          updateInvestmentData={updateInvestmentData}
          funds={funds}
          updateFunds={updateFunds}
        />
      );
    }
  };

  return (
    <div id="nav_and_main">
      <div className="logo-container">
        <img src={logo} alt="logo" />
      </div>
      {sideBar()}
      <div id="content">
        {statusMsg && (
          <StatusMsgView
            statusMsgUpdater={statusMsgUpdater}
            statusMsg={statusMsg}
          />
        )}
        <Outlet />
      </div>
      {rightCol()}
    </div>
  );
};
