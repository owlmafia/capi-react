import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitButton } from "../app_comps/SubmitButton";
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal";
import funds from "../images/funds.svg";
import error from "../images/svg/error.svg";
import { SelectWalletModal } from "../wallet/SelectWalletModal";
import { invest, updateTotalPriceAndPercentage } from "./controller";
import { DisclaimerModal } from "../modal/DisclaimerModal";
import {
  needsToAcceptDisclaimer,
  saveAcceptedDisclaimer,
} from "../modal/storage";
import { InfoView } from "../common_comps/LabeledInput";

export const InvestEmbedded = ({ deps, dao }) => {
  let params = useParams();
  const [buySharesCount, setBuySharesCount] = useState("1");
  const [totalCost, setTotalCost] = useState(null);
  const [totalCostNumber, setTotalCostNumber] = useState(null);
  const [totalPercentage, setProfitPercentage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [shareAmountError, setShareAmountError] = useState("");

  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);
  const [buyIntent, setBuyIntent] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  // show modal carries an object here, to pass details
  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] =
    useState(null);

  const onSubmitBuy = () => {
    setBuyIntent(true);
    var myAddress = deps.myAddress;
    if (myAddress === "") {
      setShowSelectWalletModal(true);
    }
  };

  useEffect(() => {
    deps.updateAvailableShares.call(null, params.id);
  }, [deps.statusMsg, params.id]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.availableSharesNumber != null) {
        if (buySharesCount) {
          updateTotalPriceAndPercentage(
            deps.statusMsg,
            buySharesCount,
            dao,
            deps.availableSharesNumber,
            setTotalCost,
            setTotalCostNumber,
            setProfitPercentage,
            deps.investmentData?.investor_locked_shares
          );
        } else {
          // no input: clear fields
          setTotalCost(null);
          setTotalCostNumber(null);
          setProfitPercentage(null);
        }
      }
    }
    nestedAsync();
  }, [
    deps.statusMsg,
    params.id,
    buySharesCount,
    deps.availableSharesNumber,
    dao,
  ]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.wallet && buyIntent && deps.myAddress) {
        setBuyIntent(false);

        await invest(
          deps.myAddress,
          setSubmitting,
          deps.statusMsg,
          deps.updateMyBalance,
          params.id,
          dao,
          deps.availableSharesNumber,
          buySharesCount,
          deps.updateMyShares,
          deps.updateFunds,
          setShareAmountError,
          deps.wallet,
          setShowBuyCurrencyInfoModal,
          totalCostNumber,
          deps.updateInvestmentData,
          deps.updateAvailableShares,
          deps.updateRaisedFunds,
          deps.updateCompactFundsActivity,
          deps.updateSharesDistr
        );
      }
    }
    nestedAsync();
    // TODO warning about missing deps here - we *don't* want to trigger this effect when inputs change,
    // we want to send whatever is in the form when user submits - so we care only about the conditions that trigger submit
    // suppress lint? are we approaching this incorrectly?
  }, [buyIntent, deps.wallet, deps.myAddress]);

  const view = () => {
    return (
      <div className="mt-80">
        <div className="dao_action_active_tab box-container">
          <div className="title">{"Buy Shares"}</div>
          <div className="buy-shares-content">
            <div className="dao-shares buy-shares-left-col">
              <div className="top-block ">
                <div className="available-shares">
                  <div className="d-flex mb-16 gap-12">
                    <div className="desc">{"Available: "}</div>
                    <div className="desc">{deps.availableShares}</div>
                  </div>
                  {deps.investmentData && (
                    <div className="shares-block">
                      <div className="desc">You have:</div>
                      <div className="shares-item">
                        <div className="shares-item-right">
                          {"Locked shares:"}
                        </div>
                        <div className="ft-weight-700">
                          {deps.investmentData.investor_locked_shares}
                        </div>
                      </div>
                      <div className="blue-circle"></div>
                      <div className="shares-item">
                        <div className="shares-item-right">
                          {"Unlocked shares:"}
                        </div>
                        <div className="ft-weight-700">
                          {deps.investmentData.investor_unlocked_shares}
                        </div>
                      </div>
                      <div className="blue-circle"></div>
                      <div className="shares-item">
                        <div className="shares-item-right">{"Share:"}</div>
                        <div className="ft-weight-700">
                          {deps.investmentData.investor_share}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <input
                  placeholder={"Enter amount"}
                  size="30"
                  type="number"
                  min="0"
                  value={buySharesCount}
                  onChange={(event) => setBuySharesCount(event.target.value)}
                />
                <div className="labeled_input__error w-100 mb-32">
                  {shareAmountError ? <img src={error} alt="error" /> : ""}
                  {shareAmountError}
                </div>
              </div>
              <SubmitButton
                label={"Buy"}
                className={"button-primary"}
                isLoading={submitting}
                onClick={async (_) => {
                  if (await needsToAcceptDisclaimer()) {
                    setShowDisclaimerModal(true);
                  } else {
                    onSubmitBuy();
                  }
                }}
              />
            </div>
            <div className="buy-shares-right-col">
              <div id="shares_const_container">
                <div className="desc">{"Total price"}</div>
                <div className="d-flex gap-10">
                  <img src={funds} alt="funds" />
                  <div className="subtitle ft-color-black-000">{totalCost}</div>
                </div>
              </div>
              <div className="d-flex mobile-input-block">
                <div id="retrieved-profits">
                  <div className="ft-weight-600 d-flex align-center gap-10 ft-size-18 nowrap">
                    {"Expected dividend"}
                    {
                      <InfoView
                        info={
                          "Total expected dividend if you buy these shares (includes already locked shares)"
                        }
                      />
                    }
                  </div>
                  <div className="d-flex gap-10">
                    <div className="subtitle ft-color-black-000">
                      {totalPercentage}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showSelectWalletModal && (
            <SelectWalletModal
              deps={deps}
              setShowModal={setShowSelectWalletModal}
            />
          )}
          {showBuyCurrencyInfoModal && deps.myAddress && (
            <BuyFundsAssetModal
              deps={deps}
              amount={showBuyCurrencyInfoModal.amount}
              closeModal={() => setShowBuyCurrencyInfoModal(null)}
            />
          )}
        </div>

        {showDisclaimerModal && (
          <DisclaimerModal
            closeModal={() => setShowDisclaimerModal(false)}
            onAccept={() => {
              saveAcceptedDisclaimer();
              setShowDisclaimerModal(false);
              // continue with buy flow: assumes that the disclaimer here is (only) shown when clicking on buy
              onSubmitBuy();
            }}
          />
        )}
      </div>
    );
  };

  return deps.availableShares && view();
};
