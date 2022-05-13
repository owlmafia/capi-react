import React from "react";
import { unlock } from "./controller";
import { LockOrUnlockShares } from "./LockOrUnlockShares";

export const UnlockShares = ({ deps, dao, daoId }) => {
  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      // currently we allow only to unlock all the shares
      showInput={false}
      title={"Unlock shares"}
      buttonLabel={"Unlock shares"}
      onSubmit={async () => {
        await unlock(
          deps.myAddress,
          deps.showProgress,
          deps.statusMsg,
          deps.updateMyBalance,
          deps.updateMyShares,
          daoId,
          dao,
          deps.updateInvestmentData
        );
      }}
    />
  );
};
