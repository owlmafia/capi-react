import React, { useEffect, useRef, useState } from "react";
import renderPieChart from "../charts/renderPieChart";
import {
  LabeledCurrencyInput,
  LabeledInput,
} from "../common_comps/LabeledInput";
import { ContentTitle } from "../ContentTitle";
import { createDao, init } from "./controller";
import { ImageUpload } from "../app_comps/ImageUpload";
import { useNavigate } from "react-router-dom";

export const CreateDao = (props) => {
  const [daoName, setDaoName] = useState("");
  const [daoDescr, setDaoDescr] = useState("");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [investorsShare, setInvestorsShare] = useState("40");
  const [sharesForInvestors, setSharesForInvestors] = useState("");
  const [imageBytes, setImageBytes] = useState([]);
  const [socialMediaUrl, setSocialMediaUrl] = useState("");

  const [daoNameError, setDaoNameError] = useState("");
  const [daoDescrError, setDaoDescrError] = useState("");
  const [shareCountError, setShareCountError] = useState("");
  const [sharePriceError, setSharePriceError] = useState("");
  const [investorsShareError, setInvestorsShareError] = useState("");
  const [sharesForInvestorsError, setSharesForInvestorsError] = useState("");
  const [socialMediaUrlError, setSocialMediaUrlError] = useState("");

  // TODO show this error
  const [imageBytesError, setImageBytesError] = useState("");

  const navigate = useNavigate();

  const investorsShareChart = useRef(null);

  useEffect(() => {
    init();
  }, []);

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

  const formView = () => {
    if (props.myAddress) {
      return (
        <div className="create-dao-container">
          <div className="dao-title">Project Info</div>
          <LabeledInput
            label={"Project name"}
            inputValue={daoName}
            onChange={(input) => setDaoName(input)}
            errorMsg={daoNameError}
          />
          <LabeledInput
            label={"Description"}
            inputValue={daoDescr}
            onChange={(input) => setDaoDescr(input)}
            errorMsg={daoDescrError}
          />
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
          {/* <LabeledInput
            label={"Share price per unit"}
            inputValue={sharePrice}
            onChange={(input) => setSharePrice(input)}
          /> */}

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

          <ImageUpload setImageBytes={setImageBytes} />
          <LabeledInput
            label={"Primary social media (optional)"}
            inputValue={socialMediaUrl}
            onChange={(input) => setSocialMediaUrl(input)}
            errorMsg={socialMediaUrlError}
          />
          <button
            className="button-primary"
            disabled={
              props.myAddress === "" ||
              daoName === "" ||
              shareCount === "" ||
              sharePrice === "" ||
              investorsShare === ""
            }
            onClick={async () => {
              await createDao(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.updateMyBalance,

                daoName,
                daoDescr,
                shareCount,
                sharePrice,
                investorsShare,
                sharesForInvestors,
                imageBytes,
                socialMediaUrl,
                navigate,

                setDaoNameError,
                setDaoDescrError,
                setShareCountError,
                setSharePriceError,
                setInvestorsShareError,
                setSharesForInvestorsError,
                setImageBytesError,
                setSocialMediaUrlError
              );
            }}
          >
            {"Create project"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      {" "}
      <ContentTitle title="Create project" />
      {formView()}
    </div>
  );
};
