import React, { useState } from "react";
import { lock } from "./controller";
import { LockOrUnlockShares } from "../investment/LockOrUnlockShares";

export const LockShares = ({ deps, dao, daoId, onLockOpt }) => {
  const [submitting, setSubmitting] = useState(false);

  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      showInput={true}
      title={"Lock shares"}
      inputLabel={"Lock shares"}
      buttonLabel={"Lock shares"}
      submitting={submitting}
      onSubmit={async (input) => {
        await lock(
          deps.myAddress,
          setSubmitting,
          deps.statusMsg,
          deps.updateMyBalance,
          daoId,
          dao,
          input,
          deps.updateMyShares,
          deps.updateInvestmentData,
          onLockOpt,
          deps.wallet
        );
      }}
    />
  );
};
