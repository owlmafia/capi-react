import React from "react";
import { lock } from "./controller";
import { LockOrUnlockShares } from "../investment/LockOrUnlockShares";

export const LockShares = ({
  statusMsg,
  showProgress,
  myAddress,
  updateMyShares,
  updateMyBalance,
  updateInvestmentData,
  dao,
  daoId,
  investmentData,
  onLockOpt,
}) => {
  console.log("!!! dao: %o", dao);
  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={investmentData}
      showInput={true}
      title={"Lock shares"}
      inputLabel={"Lock shares"}
      buttonLabel={"Lock shares"}
      onSubmit={async (input) => {
        await lock(
          myAddress,
          showProgress,
          statusMsg,
          updateMyBalance,
          daoId,
          dao,
          input,
          updateMyShares,
          updateInvestmentData,
          onLockOpt
        );
      }}
    />
  );
};
