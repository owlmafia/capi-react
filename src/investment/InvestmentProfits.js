import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { FundsAssetImg } from "../images/FundsAssetImg";
// import {updateChainInvestmentData_ as updateInvestmentData_} from "./controller";
import { init } from "./controller";
import { retrieveProfits } from "../shared_functions";

export const InvestmentProfits = ({
  statusMsg,
  showProgress,
  myAddress,
  updateMyShares,
  updateMyBalance,
  investmentData,
  updateInvestmentData,
  updateFunds,
}) => {
  let params = useParams();

  const [dao, setDao] = useState(null);

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
  }, [params.id, myAddress, statusMsg, updateInvestmentData, updateMyShares]);

  const view = () => {
    return (
      <div>
        <div className="box-container">
          <div className="title">{"Your profits by shares"}</div>
          <div className="w-80 d-flex justify-between">
            <div className="flex-block align-center">
              <div className="subTitle">{"Retrievable profits:"}</div>
              <FundsAssetImg className="fund-asset" />
              <div className="subTitle">
                {investmentData.investor_claimable_dividend}
              </div>
            </div>
            <div className="flex-block flex-column">
              <div className="subTitle retrieved">{"Retrieved profits:"}</div>
              <div className="d-flex">
                <FundsAssetImg className="fund-asset opacity-70" />
                <div className="subTitle retrieved">
                  {" "}
                  {investmentData.investor_already_retrieved_amount}
                </div>
              </div>
            </div>
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
                updateInvestmentData,
                updateFunds
              );
            }}
          >
            {"Retrieve profits"}
          </button>
        </div>
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
