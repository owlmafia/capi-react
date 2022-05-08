import React from "react";
import { unlock } from "./controller";
import { LockOrUnlockShares } from "./LockOrUnlockShares";

export const UnlockShares = ({
  statusMsg,
  showProgress,
  myAddress,
  updateMyShares,
  updateMyBalance,
  updateInvestmentData,
  dao,
  daoId,
  investmentData,
}) => {
  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={investmentData}
      // currently we allow only to unlock all the shares
      showInput={false}
      title={"Unlock shares"}
      buttonLabel={"Unlock shares"}
      onSubmit={async () => {
        await unlock(
          myAddress,
          showProgress,
          statusMsg,
          updateMyBalance,
          updateMyShares,
          daoId,
          dao,
          updateInvestmentData
        );
      }}
    />
  );
};
