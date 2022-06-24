import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SubmitButton } from "../app_comps/SubmitButton";
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal";
import { SharesDistributionChart } from "../charts/SharesDistributionChart";
import { LabeledAmountInput, LabeledInput } from "../common_comps/LabeledInput";
import { pieChartColors, PIE_CHART_GRAY } from "../common_functions/common";
import redArrow from "../images/svg/arrow.svg";
import {
  fetchAvailableShares,
  invest,
  updateTotalPriceAndPercentage,
} from "../investEmbedded/controller";

export const BuyMoreShares = ({ deps, dao }) => {
  let params = useParams();

  const [buySharesCount, setBuySharesCount] = useState(null);

  const [buySharesAmountError, setBuySharesAmountError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [totalCostNumber, setTotalCostNumber] = useState(null);
  const [availableShares, setAvailableShares] = useState(null);
  // these 2 are not used currently - copied from InvestEmbedded, which has basically the same functionality but a different UI
  // may be used in the future
  const [_totalCost, setTotalCost] = useState(null);
  const [_totalPercentage, setProfitPercentage] = useState(null);

  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] =
    useState(null);

  useEffect(() => {
    fetchAvailableShares(deps.statusMsg, params.id, setAvailableShares);
  }, [deps.statusMsg, params.id]);

  useEffect(() => {
    async function nestedAsync() {
      if (availableShares && buySharesCount) {
        updateTotalPriceAndPercentage(
          deps.statusMsg,
          buySharesCount,
          dao,
          availableShares,
          setTotalCost,
          setTotalCostNumber,
          setProfitPercentage
        );
      }
    }
    nestedAsync();
  }, [deps.statusMsg, params.id, buySharesCount, availableShares, dao]);

  const view = () => {
    return (
      <div className="buy-more-shares box-container d-flex">
        <div className="w-60 shares-mobile">
          <div className="available-shares">
            <div className="title nowrap">{"Buy more shares"}</div>
            <div className="mb-4 flex-block align-center">
              <div className="ft-size-18 ft-weight-600">{"Share supply"}</div>
              <div className="ft-weight-700 ft-size-24 color-black-000">
                {dao.share_supply}
              </div>
              <div>
                <img src={redArrow} alt="redArrow" />
              </div>
            </div>
            <div className="chartBlock">
              <div className="numbers ft-size-18 ft-weight-600">
                {availableShares}
              </div>
              <div className="h-16">
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8.5" r="8" fill="#DEE2E2" />
                </svg>
              </div>
              <div>{"Available"}</div>
            </div>
            <div className="chartBlock">
              <div className="numbers ft-size-18 ft-weight-600">
                {deps.investmentData.investor_locked_shares}
              </div>
              <div className="h-16">
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8.5" r="8" fill="#8ECACD" />
                </svg>
              </div>
              <div>{"Your locked shares"}</div>
            </div>
            <div className="chartBlock">
              <div className="numbers ft-size-18 ft-weight-600">
                {deps.investmentData.investor_unlocked_shares}
              </div>
              <div className="h-16">
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8.5" r="8" fill="#6BB9BD" />
                </svg>
              </div>
              <div>{"Your unlocked shares"}</div>
            </div>
          </div>
          <div>
            <LabeledAmountInput
              label={"Buy shares"}
              placeholder={"Enter amount"}
              inputValue={buySharesCount}
              onChange={(input) => setBuySharesCount(input)}
              errorMsg={buySharesAmountError}
            />
            <SubmitButton
              label={"Buy"}
              className="button-primary"
              isLoading={submitting}
              disabled={deps.investmentData.available_shares === "0"}
              onClick={async () => {
                await invest(
                  deps.myAddress,
                  setSubmitting,
                  deps.statusMsg,
                  deps.updateMyBalance,
                  params.id,
                  dao,
                  buySharesCount,
                  deps.updateMyShares,
                  deps.updateFunds,
                  setBuySharesAmountError,
                  deps.wallet,
                  setShowBuyCurrencyInfoModal,
                  totalCostNumber
                );
              }}
            />
          </div>
        </div>
        <div className="shares-chart">
          <SharesDistributionChart
            sharesDistr={[
              to_pie_chart_slice(availableShares),
              to_pie_chart_slice(deps.investmentData.investor_locked_shares),
              to_pie_chart_slice(deps.investmentData.investor_unlocked_shares),
            ]}
            // we want to show available shares in gray and it's the first segment, so we prepend gray to the colors
            // note that this is inconsistent with how it's shown on investors distribution (using NOT_OWNED segment type)
            // we should refactor this (maybe create a generic "gray" segment type)
            col={[PIE_CHART_GRAY].concat(pieChartColors())}
            animated={false}
            disableClick={true}
          />
        </div>
        {showBuyCurrencyInfoModal && deps.myAddress && (
          <BuyFundsAssetModal
            deps={deps}
            amount={showBuyCurrencyInfoModal.amount}
            closeModal={() => setShowBuyCurrencyInfoModal(null)}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div>{dao && deps.investmentData && availableShares && view()}</div>
    </div>
  );
};

const to_pie_chart_slice = (percentage) => {
  return { percentage_number: percentage };
};
