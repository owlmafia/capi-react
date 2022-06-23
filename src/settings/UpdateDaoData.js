import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitButton } from "../app_comps/SubmitButton";
import { LabeledInput, LabeledTextArea } from "../common_comps/LabeledInput";
import { prefillInputs, rekeyOwner, updateDaoData } from "./controller";
import { ImageUpload } from "../app_comps/ImageUpload";
import { toBytesForRust } from "../common_functions/common";

export const UpdateDaoData = ({ deps }) => {
  let params = useParams();

  const [daoName, setDaoName] = useState("");
  const [daoDescr, setDaoDescr] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [imageBytes, setImageBytes] = useState(null);
  const [socialMediaUrl, setSocialMediaUrl] = useState("");

  const [customerEscrow, setCustomerEscrow] = useState("");
  const [customerEscrowVersion, setCustomerEscrowVersion] = useState("");

  const [rekeyAuthAddress, setRekeyAuthAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [daoNameError, setDaoNameError] = useState("");
  const [daoDescrError, setDaoDescrError] = useState("");
  const [socialMediaUrlError, setSocialMediaUrlError] = useState("");
  const [imageError, setImageError] = useState("");
  const [escrowAddressError, setEscrowAddressError] = useState("");
  const [escrowVersionError, setEscrowVersionError] = useState("");

  const [rekeyAddressError, setRekeyAddressError] = useState("");

  useEffect(() => {
    async function prefill() {
      if (params.id) {
        await prefillInputs(
          deps.statusMsg,
          params.id,
          setDaoName,
          setDaoDescr,
          setSharePrice,
          setImageBytes,
          setSocialMediaUrl,
          setCustomerEscrow,
          setCustomerEscrowVersion
        );
      }
    }
    prefill();
  }, [params.id, deps.statusMsg]);

  const body = () => {
    return (
      <div className="update-dao-data">
        <div className="subtitle">{"Update project data"}</div>
        <div className="info">{"Project Info"}</div>
        <LabeledInput
          label={"Project name"}
          inputValue={daoName}
          onChange={(input) => setDaoName(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={daoNameError}
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={daoDescr}
          onChange={(input) => setDaoDescr(input)}
          maxLength={2000} // NOTE: has to match WASM
          errorMsg={daoDescrError}
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
          errorMsg={escrowAddressError}
        />
        <LabeledInput
          label={"Payments escrow version"}
          inputValue={customerEscrowVersion}
          onChange={(input) => setCustomerEscrowVersion(input)}
          errorMsg={escrowVersionError}
        />
        {/* <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          onChange={(input) => setSocialMediaUrl(input)}
          errorMsg={socialMediaUrlError}
        /> */}
        <SubmitButton
          label={"Update data"}
          className="button-primary"
          isLoading={submitting}
          onClick={async () => {
            updateDaoData(
              deps.statusMsg,
              setSubmitting,
              {
                dao_id: params.id,

                customer_escrow: customerEscrow,
                customer_escrow_version: customerEscrowVersion,

                project_name: daoName,
                project_desc: daoDescr,
                share_price: sharePrice,

                owner: deps.myAddress,

                image: await toBytesForRust(imageBytes),
                social_media_url: socialMediaUrl,
              },
              deps.wallet,
              setDaoNameError,
              setDaoDescrError,
              setImageError,
              setSocialMediaUrlError,
              setEscrowAddressError,
              setEscrowVersionError
            );
          }}
        />
        <div className="subtitle settings-space">{"Ownership"}</div>
        <LabeledInput
          label={"Rekey owner to:"}
          inputValue={rekeyAuthAddress}
          onChange={(input) => setRekeyAuthAddress(input)}
          errorMsg={rekeyAddressError}
        />
        <SubmitButton
          label={"Rekey owner"}
          className="button-primary mb-7"
          isLoading={submitting}
          onClick={async () => {
            rekeyOwner(
              deps.statusMsg,
              setSubmitting,
              params.id,
              rekeyAuthAddress,
              deps.wallet,
              setRekeyAddressError
            );
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
