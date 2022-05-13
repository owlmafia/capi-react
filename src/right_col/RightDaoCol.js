import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FundsActivityEmbedded } from "../funds_activity/FundsActivityEmbedded";
import { init } from "./controller";
import { MyAccount } from "../app_comps/MyAccount";

export const RightDaoCol = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,
  updateMyShares,
  myDividend,
  updateMyDividend,
  showProgress,
  updateInvestmentData,
  funds,
  updateFunds,
  fundsChange,
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

  useEffect(() => {
    async function asyncFn() {
      updateMyDividend(params.id, myAddress);
    }
    if (myAddress) {
      asyncFn();
    }
  }, [params.id, myAddress, updateMyDividend]);

  useEffect(() => {
    async function asyncFn() {
      updateFunds(params.id, myAddress);
    }
    if (myAddress) {
      asyncFn();
    }
  }, [params.id, myAddress, updateFunds]);

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
        myDividend={myDividend}
        showProgress={showProgress}
        updateInvestmentData={updateInvestmentData}
        updateFunds={updateFunds}
      />
      <FundsActivityEmbedded
        statusMsg={statusMsgUpdater}
        daoId={params.id}
        funds={funds}
        fundsChange={fundsChange}
      />
    </div>
  );
};
