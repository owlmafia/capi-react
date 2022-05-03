import React, { useEffect } from "react";
import { init } from "./controller";
import { MyAccount } from "../app_comps/MyAccount";

export const RightCol = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,
}) => {
  useEffect(() => {
    async function asyncInit() {
      await init(statusMsgUpdater);
    }
    asyncInit();
  }, [statusMsgUpdater]);

  return (
    <div id="rightcol">
      <MyAccount
        myAddress={myAddress}
        setMyAddress={setMyAddress}
        myAddressDisplay={myAddressDisplay}
        setMyAddressDisplay={setMyAddressDisplay}
        myBalance={myBalance}
        updateMyBalance={updateMyBalance}
        statusMsgUpdater={statusMsgUpdater}
        // no dao here
        daoId={null}
      />
    </div>
  );
};
