import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MyAccount } from "../app_comps/MyAccount";

export const MobileWalletView = ({ deps, containerClass, onClose }) => {
  let params = useParams();

  useEffect(() => {
    async function asyncFn() {
      await deps.updateMyShares.call(null, params.id, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [params.id, deps.myAddress, deps.updateMyShares]);

  useEffect(() => {
    async function asyncFn() {
      deps.updateMyDividend.call(null, params.id, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [params.id, deps.myAddress, deps.updateMyDividend]);

  return (
    <div id={containerClass}>
      <MyAccount deps={deps} daoId={params.id} onClose={onClose} />
    </div>
  );
};
