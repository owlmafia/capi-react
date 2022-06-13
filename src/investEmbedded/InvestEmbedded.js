import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import funds from "../images/funds.svg";
import {
  fetchAvailableShares,
  invest,
  updateTotalPriceAndPercentage,
} from "./controller";
import ReactTooltip from "react-tooltip";
import { SubmitButton } from "../app_comps/SubmitButton";
import { SelectWalletModal } from "../wallet/SelectWalletModal";
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal";
import info from "../images/svg/info.svg";

export const InvestEmbedded = ({ deps, dao }) => {
  let params = useParams();
  const [buySharesCount, setBuySharesCount] = useState("1");
  const [totalCost, setTotalCost] = useState(null);
  const [totalCostNumber, setTotalCostNumber] = useState(null);
  const [availableShares, setAvailableShares] = useState(null);
  const [totalPercentage, setProfitPercentage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [shareAmountError, setShareAmountError] = useState("");

  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);
  const [buyIntent, setBuyIntent] = useState(false);

  // show modal carries an object here, to pass details
  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] =
    useState(null);

  useEffect(() => {
    fetchAvailableShares(deps.statusMsg, params.id, setAvailableShares);
  }, [deps.statusMsg, params.id]);

  useEffect(() => {
    async function nestedAsync() {
      if (availableShares) {
        if (buySharesCount) {
          updateTotalPriceAndPercentage(
            deps.statusMsg,
            buySharesCount,
            dao,
            availableShares,
            setTotalCost,
            setTotalCostNumber,
            setProfitPercentage
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
  }, [deps.statusMsg, params.id, buySharesCount, availableShares, dao]);

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
          buySharesCount,
          deps.updateMyShares,
          deps.updateFunds,
          setShareAmountError,
          deps.wallet,
          setShowBuyCurrencyInfoModal,
          totalCostNumber
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
      <div>
        <div className="labeled_box_label">Investitions</div>
        <div className="dao_action_active_tab box-container">
          <div className="title">{"Buy Shares in project"}</div>
          <div className="dao-shares">
            <div className="top-block">
              <div className="available-shares">
                <div className="d-flex gap-10 ft-weight-600">
                  <div className="subTitle mb-4">{"Available shares: "}</div>
                  <div className="ft-weight-600">{availableShares}</div>
                </div>
                {deps.investmentData && (
                  <div className="shares-block">
                    <div className="ft-weight-600">You have:</div>
                    <div className="shares-item">
                      <div>{"Locked shares:"}</div>
                      <div className="ft-weight-600">
                        {deps.investmentData.investor_locked_shares}
                      </div>
                    </div>
                    <div className="blue-circle"></div>
                    <div className="shares-item">
                      <div>{"Unlocked shares:"}</div>
                      <div className="ft-weight-600">
                        {deps.investmentData.investor_unlocked_shares}
                      </div>
                    </div>
                    <div className="blue-circle"></div>
                    <div className="d-flex gap-10 align-center">
                      <div>{"Dividend"}</div>
                      <div data-tip="Your share of the project's income, after locking your shares"></div>
                      <ReactTooltip />
                      <div>{totalPercentage}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div id="shares_const_container">
              <div className="ft-weight-600">{"Shares cost"}</div>
              <div className="d-flex gap-10">
                <img src={funds} alt="funds" />
                <div className="one_line_key_val_val ft-weight-600">
                  {totalCost}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex mobile-input-block">
            <div className="w-80">
              <div className="labeled_input__error">{shareAmountError}</div>
              <input
                className="w-80 label-input-style mt-1"
                placeholder={"Enter amount of shares"}
                size="30"
                value={buySharesCount}
                onChange={
                  (event) => setBuySharesCount(event.target.value)
                  // onSharesInput(event.target.value)
                }
              />
            </div>
            <div id="retrieved-profits">
              <div className="ft-weight-600 d-flex align-center gap-10">
                {"Retrievable profits"}
                <img src={info} alt="info" />
              </div>
              <div className="d-flex gap-10">
                <img src={funds} alt="funds" />
                <div className="one_line_key_val_val ft-weight-600">
                  {totalCost}
                </div>
              </div>
            </div>
          </div>
          <SubmitButton
            label={"Buy shares"}
            className={"button-primary"}
            isLoading={submitting}
            onClick={async (_) => {
              setBuyIntent(true);
              var myAddress = deps.myAddress;
              if (myAddress === "") {
                setShowSelectWalletModal(true);
              }
            }}
          />
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
      </div>
    );
  };

  return availableShares && view();
};
