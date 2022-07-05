import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { FundsAssetImg } from "../images/FundsAssetImg";
// import {updateChainInvestmentData_ as updateInvestmentData_} from "./controller";
import { init } from "./controller";
import { retrieveProfits } from "../shared_functions";
import { SubmitButton } from "../app_comps/SubmitButton";
import Progress from "../app_comps/Progress";

export const InvestmentProfits = ({ deps }) => {
  let params = useParams();

  const [dao, setDao] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (dao && deps.investmentData) {
      return (
        <div>
          <div className="box-container">
            <div className="title">{"Your profits"}</div>
            <div className="retrievable-profits">
              <div className="retrievable-tab">
                <div className="flex-block align-center">
                  <div className="desc">{"Retrievable:"}</div>
                  <FundsAssetImg className="fund-asset" />
                  <div className="subtitle">
                    {deps.investmentData.investor_claimable_dividend}
                  </div>
                </div>
                <SubmitButton
                  label={"Retrieve"}
                  className="button-primary"
                  isLoading={submitting}
                  disabled={
                    deps.investmentData.investor_claimable_dividend === "0"
                  }
                  onClick={async () => {
                    await retrieveProfits(
                      deps.myAddress,
                      setSubmitting,
                      deps.statusMsg,
                      deps.updateMyBalance,
                      params.id,
                      deps.updateInvestmentData,
                      deps.updateFunds,
                      deps.wallet
                    );
                  }}
                />
              </div>
              <div className="retrieved-tab">
                <div className="desc">{"Retrieved:"}</div>
                <div className="flex-block align-center">
                  <FundsAssetImg className="fund-asset" />
                  <div className="subtitle">
                    {" "}
                    {deps.investmentData.investor_already_retrieved_amount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Progress />;
    }
  };

  return (
    <div>
      <ContentTitle title={"My investment"} />
      <div className="mt-40">{view()}</div>
    </div>
  );
};
