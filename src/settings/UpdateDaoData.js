import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitButton } from "../app_comps/SubmitButton";
import { LabeledInput, LabeledTextArea } from "../common_comps/LabeledInput";
import { prefillInputs, rekeyOwner, updateDaoData } from "./controller";
import { ImageUpload } from "../app_comps/ImageUpload";
import { toBytesForRust } from "../common_functions/common";
import { OkCancelModal } from "../modal/OkCancelModal";

export const UpdateDaoData = ({ deps }) => {
  let params = useParams();

  const [daoName, setDaoName] = useState("");
  const [daoDescr, setDaoDescr] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [imageBytes, setImageBytes] = useState(null);
  const [socialMediaUrl, setSocialMediaUrl] = useState("");

  const [rekeyAuthAddress, setRekeyAuthAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [daoNameError, setDaoNameError] = useState("");
  const [daoDescrError, setDaoDescrError] = useState("");
  const [socialMediaUrlError, setSocialMediaUrlError] = useState("");
  const [imageError, setImageError] = useState("");

  const [rekeyAddressError, setRekeyAddressError] = useState("");
  const [showConfirmRekeyModal, setShowConfirmRekeyModal] = useState(false);

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
          setSocialMediaUrl
        );
      }
    }
    prefill();
  }, [params.id, deps.statusMsg]);

  const body = () => {
    return (
      <div className="update-dao-data">
        <div className="ft-size-32 ft-weight-700 mt-80 mb-48">
          {"Update project data"}
        </div>
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
        <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          onChange={(input) => setSocialMediaUrl(input)}
          errorMsg={socialMediaUrlError}
        />
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
              setSocialMediaUrlError
            );
          }}
        />
        <div className="info settings-space">{"Ownership"}</div>
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
            setShowConfirmRekeyModal(true);
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <div>{body()}</div>
      {showConfirmRekeyModal && (
        <OkCancelModal
          title="WARNING"
          closeModal={() => setShowConfirmRekeyModal(false)}
          okLabel="Continue"
          cancelLabel="Cancel"
          onSubmit={() => {
            rekeyOwner(
              deps.statusMsg,
              setSubmitting,
              params.id,
              rekeyAuthAddress,
              deps.wallet,
              setRekeyAddressError
            );
            setShowConfirmRekeyModal(false);
          }}
        >
          <div className="mb-16">
            {"This will transfer all signing authority to the entered address."}
          </div>
          <div className="ft-weight-bold mb-16">
            {
              "YOUR CURRENT ACCOUNT WILL IRREVERSIBLY BECOME USELESS: IT WILL NOT BE ABLE TO SIGN *ANY* TRANSACTIONS (INCLUDING REVERTING THIS OPERATION)."
            }
          </div>
          <div className="ft-weight-bold mb-16">
            {
              "THIS IS A UNIVERSAL (BLOCKCHAIN-WIDE) OPERATION, NOT LIMITED TO CAPI."
            }
          </div>
          <div>
            <div className="mb-16">{"Please ensure:"}</div>
            <ol>
              <li>{"That the entered address to be rekeyed to is correct."}</li>
              <li>
                {
                  "That you / the expected account owner(s) of said address actually own it, i.e., can successfully sign and submit transactions with it."
                }
              </li>
            </ol>
            <div className="ft-weight-bold  mb-16">
              {"IF ANY OF THE POINTS ABOVE IS NOT TRUE, " +
                "YOUR CAPI PROJECT, AS WELL AS ANY FUNDS, ASSETS AND APPLICATIONS LINKED TO YOUR CURRENT ADDRESS, RELATED OR NOT RELATED TO CAPI, WILL BE PERMANENTLY AND IRREVERSIBLY LOST."}
            </div>
          </div>
        </OkCancelModal>
      )}
    </div>
  );
};
