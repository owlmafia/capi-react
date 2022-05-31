import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitButton } from "../app_comps/SubmitButton";
import {
  LabeledCurrencyInput,
  LabeledInput,
} from "../common_comps/LabeledInput";
import { prefillInputs, updateDaoData } from "./controller";
import { ImageUpload } from "../app_comps/ImageUpload";
import { toBytesForRust } from "../common_functions/common";

export const UpdateDaoData = ({ statusMsg }) => {
  let params = useParams();

  const [daoName, setDaoName] = useState("");
  const [daoDescr, setDaoDescr] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [imageBytes, setImageBytes] = useState(null);
  const [socialMediaUrl, setSocialMediaUrl] = useState("");

  const [customerEscrow, setCustomerEscrow] = useState("");
  const [customerEscrowVersion, setCustomerEscrowVersion] = useState("");

  const [owner, setOwner] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function prefill() {
      if (params.id) {
        await prefillInputs(
          statusMsg,
          params.id,
          setDaoName,
          setDaoDescr,
          setSharePrice,
          setImageBytes,
          setSocialMediaUrl,
          setCustomerEscrow,
          setCustomerEscrowVersion,
          setOwner
        );
      }
    }
    prefill();
  }, [params.id, statusMsg]);

  const body = () => {
    return (
      <div className="update-dao-data">
        <div className="subtitle">{"Update project data"}</div>
        <div className="info">{"Project Info"}</div>
        <LabeledInput
          label={"Project name"}
          inputValue={daoName}
          onChange={(input) => setDaoName(input)}
        />
        <LabeledInput
          label={"Description"}
          inputValue={daoDescr}
          onChange={(input) => setDaoDescr(input)}
        />
        <div className="info">Project Cover</div>
        <ImageUpload
          initImageBytes={imageBytes}
          setImageBytes={setImageBytes}
        />
        <div className="info">{"Payments"}</div>
        <LabeledInput
          label={"Payments address"}
          inputValue={customerEscrow}
          onChange={(input) => setCustomerEscrow(input)}
        />
        <LabeledInput
          label={"Payments escrow version"}
          inputValue={customerEscrowVersion}
          onChange={(input) => setCustomerEscrowVersion(input)}
        />
        {/* <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          onChange={(input) => setSocialMediaUrl(input)}
        /> */}
        <div className="info">{"Ownership"}</div>
        <LabeledInput
          label={"Project owner"}
          inputValue={owner}
          onChange={(input) => setOwner(input)}
        />
        <SubmitButton
          label={"Update data"}
          className="button-primary"
          isLoading={submitting}
          onClick={async () => {
            updateDaoData(statusMsg, setSubmitting, {
              dao_id: params.id,
              owner: owner,

              customer_escrow: customerEscrow,
              customer_escrow_version: customerEscrowVersion,

              project_name: daoName,
              project_desc: daoDescr,
              share_price: sharePrice,

              image: toBytesForRust(imageBytes),
              social_media_url: socialMediaUrl,
            });
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <div>{body()}</div>
    </div>
  );
};
