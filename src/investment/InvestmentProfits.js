import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import {
  init,
  retrieveProfits,
  updateChainInvestmentData_ as updateInvestmentData_,
} from "./controller";

export const InvestmentProfits = ({
  statusMsg,
  showProgress,
  myAddress,
  updateMyShares,
  updateMyBalance,
}) => {
  let params = useParams();

  const [dao, setDao] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);

  const updateInvestmentData = useCallback(async () => {
    if (myAddress) {
      await updateInvestmentData_(
        statusMsg,
        myAddress,
        params.id,
        setInvestmentData
      );
    }
  }, [statusMsg, myAddress, params.id]);

  useEffect(() => {
    async function doInit() {
      await init(
        params.id,
        myAddress,
        statusMsg,
        setDao,
        updateInvestmentData,
        updateMyShares
      );
    }
    doInit();
  }, [params.id, myAddress, statusMsg]);

  const view = () => {
    return (
      <div>
        <div>
          <div>{"Your profits by shares"}</div>
          <div>{"Retrievable profits:"}</div>
          <div>{investmentData.investor_claimable_dividend}</div>
          <div>{"Retrieved profits:"}</div>
          <div> {investmentData.investor_already_retrieved_amount}</div>
        </div>
        <button
          className="button-primary"
          disabled={investmentData.investor_claimable_dividend === "0"}
          onClick={async () => {
            await retrieveProfits(
              myAddress,
              showProgress,
              statusMsg,
              updateMyBalance,
              params.id,
              dao,
              investmentData.investor_claimable_dividend_microalgos,
              updateInvestmentData
            );
          }}
        >
          {"Retrieve profits"}
        </button>
      </div>
    );
  };

  return (
    <div>
      <ContentTitle title={"My investment"} />
      <div>{dao && investmentData && view()}</div>
    </div>
  );
};
