import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FundsAssetImg } from "../images/FundsAssetImg";
// import {updateChainInvestmentData_ as updateInvestmentData_} from "./controller";
import { init } from "./controller";
import { retrieveProfits } from "../shared_functions";
import { SubmitButton } from "../common_comps/SubmitButton";
import Progress from "../common_comps/Progress";

export const InvestmentProfits = ({ deps }) => {
  let params = useParams();

  const [dao, setDao] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function doInit() {
      await init(deps, params.id, setDao);
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
                  label={"Claim"}
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
                      deps.updateMyDividend,
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
      <div className="mt-40">{view()}</div>
    </div>
  );
};
