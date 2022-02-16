import { Outlet } from "react-router-dom";
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
}) => {
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
    </div>
  );
};
