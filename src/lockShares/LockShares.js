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
      buttonLabel={"Lock"}
      submitting={submitting}
      onSubmit={async (input, setInputError) => {
        await lock(
          deps.statusMsg,
          deps.myAddress,
          deps.wallet,
          deps.updateInvestmentData,
          deps.updateMyBalance,
          deps.updateMyShares,

          setSubmitting,
          daoId,
          dao,
          input,
          onLockOpt,
          setInputError
        );
      }}
    />
  );
};
