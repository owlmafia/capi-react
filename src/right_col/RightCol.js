import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FundsActivityEmbedded } from "../funds_activity/FundsActivityEmbedded";
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
  myShares,
  updateMyShares,
}) => {
  let params = useParams();

  useEffect(() => {
    async function asyncInit() {
      await init(statusMsgUpdater);
    }
    asyncInit();
  }, [statusMsgUpdater]);

  useEffect(() => {
    async function asyncFn() {
      updateMyShares(params.id, myAddress);
    }
    if (myAddress) {
      asyncFn();
    }
  }, [params.id, myAddress, updateMyShares]);

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
        daoId={params.id}
        myShares={myShares}
      />
      <FundsActivityEmbedded
        statusMsg={statusMsgUpdater}
        daoId={params.id}
        myAddress={myAddress}
      />
    </div>
  );
};
