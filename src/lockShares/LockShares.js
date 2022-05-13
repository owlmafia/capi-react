import React from "react";
import { lock } from "./controller";
import { LockOrUnlockShares } from "../investment/LockOrUnlockShares";

export const LockShares = ({ deps, dao, daoId, onLockOpt }) => {
  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      showInput={true}
      title={"Lock shares"}
      inputLabel={"Lock shares"}
      buttonLabel={"Lock shares"}
      onSubmit={async (input) => {
        await lock(
          deps.myAddress,
          deps.showProgress,
          deps.statusMsg,
          deps.updateMyBalance,
          daoId,
          dao,
          input,
          deps.updateMyShares,
          deps.updateInvestmentData,
          onLockOpt
        );
      }}
    />
  );
};
