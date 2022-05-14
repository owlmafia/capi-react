import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FundsActivityEmbedded } from "../funds_activity/FundsActivityEmbedded";
import { MyAccount } from "../app_comps/MyAccount";

export const RightDaoCol = ({ deps }) => {
  let params = useParams();

  useEffect(() => {
    async function asyncFn() {
      await deps.updateMyShares.call(params.id, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [params.id, deps.myAddress, deps.updateMyShares]);

  useEffect(() => {
    async function asyncFn() {
      deps.updateMyDividend.call(params.id, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [params.id, deps.myAddress, deps.updateMyDividend]);

  useEffect(() => {
    async function asyncFn() {
      deps.updateFunds.call(params.id, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [params.id, deps.myAddress, deps.updateFunds]);

  return (
    <div id="rightcol">
      <MyAccount deps={deps} daoId={params.id} />
      <FundsActivityEmbedded deps={deps} daoId={params.id} />
    </div>
  );
};
