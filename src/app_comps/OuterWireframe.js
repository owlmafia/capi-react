import { Outlet } from "react-router-dom";
import { MyAccount } from "./MyAccount.js";

export const OuterWireframe = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  setMyBalance,
  statusMsgUpdater,
}) => {
  return (
    <div>
      <MyAccount
        myAddress={myAddress}
        setMyAddress={setMyAddress}
        myAddressDisplay={myAddressDisplay}
        setMyAddressDisplay={setMyAddressDisplay}
        myBalance={myBalance}
        setMyBalance={setMyBalance}
        statusMsgUpdater={statusMsgUpdater}
      />
      <Outlet />
    </div>
  );
};
