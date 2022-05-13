import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { FundsAssetImg } from "../images/FundsAssetImg";
// import {updateChainInvestmentData_ as updateInvestmentData_} from "./controller";
import { init } from "./controller";
import { retrieveProfits } from "../shared_functions";

export const InvestmentProfits = ({ deps }) => {
  let params = useParams();

  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function doInit() {
      await init(
        params.id,
        deps.myAddress,
        deps.statusMsg,
        setDao,
        deps.updateInvestmentData,
        deps.updateMyShares
      );
    }
    doInit();
  }, [
    params.id,
    deps.myAddress,
    deps.statusMsg,
    deps.updateInvestmentData,
    deps.updateMyShares,
  ]);

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
                {deps.investmentData.investor_claimable_dividend}
              </div>
            </div>
            <div className="flex-block flex-column">
              <div className="subTitle retrieved">{"Retrieved profits:"}</div>
              <div className="d-flex">
                <FundsAssetImg className="fund-asset opacity-70" />
                <div className="subTitle retrieved">
                  {" "}
                  {deps.investmentData.investor_already_retrieved_amount}
                </div>
              </div>
            </div>
          </div>
          <button
            className="button-primary"
            disabled={deps.investmentData.investor_claimable_dividend === "0"}
            onClick={async () => {
              await retrieveProfits(
                deps.myAddress,
                deps.showProgress,
                deps.statusMsg,
                deps.updateMyBalance,
                params.id,
                deps.updateInvestmentData,
                deps.updateFunds
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
      <div>{dao && deps.investmentData && view()}</div>
    </div>
  );
};
