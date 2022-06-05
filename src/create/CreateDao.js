import React, { useEffect, useRef, useState, useCallback } from "react";
import renderPieChart from "../charts/renderPieChart";
import {
  LabeledCurrencyInput,
  LabeledInput,
  LabeledTextArea,
} from "../common_comps/LabeledInput";
import { ContentTitle } from "../ContentTitle";
import { createDao } from "./controller";
import { ImageUpload } from "../app_comps/ImageUpload";
import { useNavigate } from "react-router-dom";
import { SubmitButton } from "../app_comps/SubmitButton";
import { BuyCurrencyInfoView } from "../buy_currency/BuyCurrencyInfoView";
import Modal from "../Modal";
import { SelectWallet } from "../wallet/SelectWallet";

export const CreateDao = ({ deps }) => {
  const [daoName, setDaoName] = useState("My project");
  const [daoDescr, setDaoDescr] = useState("Lorem ipsum dolor sit amet");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [investorsShare, setInvestorsShare] = useState("40");
  const [sharesForInvestors, setSharesForInvestors] = useState("100");
  const [imageBytes, setImageBytes] = useState([]);
  const [socialMediaUrl, setSocialMediaUrl] = useState(
    "https://twitter.com/doesnotexist"
  );
  // mock data, while we've no UI for this
  const [minRaiseTarget, setMinRaiseTarget] = useState("0");
  // mock data, while we've no UI for this
  // this is a "date in the past", meaning that there's practically no funds raising phase
  const [minRaiseTargetEndDate, setMinRaiseTargetEndDate] =
    useState("1652945905");

  const [daoNameError, setDaoNameError] = useState("");
  const [daoDescrError, setDaoDescrError] = useState("");
  const [shareCountError, setShareCountError] = useState("");
  const [sharePriceError, setSharePriceError] = useState("");
  const [investorsShareError, setInvestorsShareError] = useState("");
  const [sharesForInvestorsError, setSharesForInvestorsError] = useState("");
  const [socialMediaUrlError, setSocialMediaUrlError] = useState("");
  // mock data, while we've no UI for this
  const [minRaiseTargetError, setMinRaiseTargetError] = useState("");

  const [minRaiseTargetEndDateError, setMinRaiseTargetEndDateError] =
    useState("");

  // TODO show this error
  const [imageBytesError, setImageBytesError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const investorsShareChart = useRef(null);

  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] =
    useState(false);

  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);
  const [pendingSubmitDao, setPendingSubmitDao] = useState(false);

  useEffect(() => {
    if (investorsShareChart.current) {
      // investors share % expected to be 0-100 (user input)
      // note that this text currently isn't validated and can be anything - the d3 chart shows the last valid data, no errors.
      const nonInvestorsShare = 100 - investorsShare;
      // the labels are irrelevant here
      const data = { a: investorsShare, b: nonInvestorsShare };
      renderPieChart(investorsShareChart.current, data, (d) => d[1]);
    }
    // for now no deps - mutable value doesn't cause a re-render
    //   }, [investorsShare, investorsShareChart.current]);
  });

  useEffect(async () => {
    if (deps.wallet && pendingSubmitDao && deps.myAddress) {
      setPendingSubmitDao(false);

      await createDao(
        deps.myAddress,
        setSubmitting,
        deps.statusMsg,
        deps.updateMyBalance,

        daoName,
        daoDescr,
        shareCount,
        sharePrice,
        investorsShare,
        sharesForInvestors,
        imageBytes,
        socialMediaUrl,
        minRaiseTarget,
        minRaiseTargetEndDate,

        navigate,

        setDaoNameError,
        setDaoDescrError,
        setShareCountError,
        setSharePriceError,
        setInvestorsShareError,
        setSharesForInvestorsError,
        setImageBytesError,
        setSocialMediaUrlError,
        setMinRaiseTargetError,
        setMinRaiseTargetEndDateError,
        setShowBuyCurrencyInfoModal,

        deps.wallet
      );
    }
  }, [pendingSubmitDao, deps.wallet, deps.myAddress]);

  const formView = () => {
    return (
      <div className="create-dao-container">
        <div className="dao-title">Project Info</div>
        <LabeledInput
          label={"Project name"}
          inputValue={daoName}
          onChange={(input) => setDaoName(input)}
          errorMsg={daoNameError}
          maxLength={40} // NOTE: has to match WASM
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={daoDescr}
          onChange={(input) => setDaoDescr(input)}
          errorMsg={daoDescrError}
          maxLength={2000} // NOTE: has to match WASM
        />
        <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          onChange={(input) => setSocialMediaUrl(input)}
          errorMsg={socialMediaUrlError}
        />
        <div className="dao-title">Project Cover</div>
        <ImageUpload setImageBytes={setImageBytes} />
        <div className="dao-title">Project Funds</div>
        <LabeledInput
          label={"Share supply"}
          inputValue={shareCount}
          onChange={(input) => setShareCount(input)}
          errorMsg={shareCountError}
        />
        <LabeledCurrencyInput
          label={"Share price per unit"}
          inputValue={sharePrice}
          onChange={(input) => setSharePrice(input)}
          errorMsg={sharePriceError}
        />
        <LabeledCurrencyInput
          label={"Investor's part:"}
          inputValue={investorsShare}
          onChange={(input) => setInvestorsShare(input)}
          errorMsg={investorsShareError}
          placeholder="Investor's part in %"
        />
        <LabeledCurrencyInput
          label={"Shares for investors"}
          inputValue={sharesForInvestors}
          onChange={(input) => setSharesForInvestors(input)}
          errorMsg={sharesForInvestorsError}
        />
        <SubmitButton
          label={"Create project"}
          className={"button-primary"}
          isLoading={submitting}
          disabled={
            daoName === "" ||
            shareCount === "" ||
            sharePrice === "" ||
            investorsShare === ""
          }
          onClick={async () => {
            // signalize that we want to submit the dao
            // if other dependencies are already present (connected wallet / address), an effect will trigger submit
            // if they're not, we start the wallet connection flow next (select wallet modal),
            // which sets these dependencies when finished, which triggers the effect too
            setPendingSubmitDao(true);
            var myAddress = deps.myAddress;
            if (myAddress === "") {
              setShowSelectWalletModal(true);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div>
      {" "}
      <ContentTitle title="Create project" />
      {formView()}
      {showBuyCurrencyInfoModal && deps.myAddress && (
        <Modal
          title={"Top your account"}
          onCloseClick={() => setShowBuyCurrencyInfoModal(false)}
        >
          <BuyCurrencyInfoView
            deps={deps}
            closeModal={() => setShowBuyCurrencyInfoModal(false)}
          />
        </Modal>
      )}
      {showSelectWalletModal && (
        <Modal
          title={"Choose a wallet"}
          onCloseClick={() => setShowSelectWalletModal(false)}
        >
          <SelectWallet
            deps={deps}
            onConnected={async () => {
              setShowSelectWalletModal(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
};
