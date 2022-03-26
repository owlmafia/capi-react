import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LabeledCurrencyInput,
  LabeledInput,
} from "../common_comps/LabeledInput";
import { ContentTitle } from "../ContentTitle";
import { init, prefillInputs, updateDaoData } from "./controller";

export const UpdateDaoData = ({ statusMsg, showProgress }) => {
  let params = useParams();

  const [daoName, setDaoName] = useState("");
  const [daoDescr, setDaoDescr] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [socialMediaUrl, setSocialMediaUrl] = useState("");

  const [centralEscrow, setCentralEscrow] = useState("");
  const [customerEscrow, setCustomerEscrow] = useState("");
  const [investingEscrow, setInvestingEscrow] = useState("");
  const [lockingEscrow, setLockingEscrow] = useState("");

  const [owner, setOwner] = useState("");

  useEffect(() => {
    async function asyncInit() {
      await init(statusMsg);
    }
    asyncInit();
  }, [statusMsg]);

  useEffect(() => {
    async function prefill() {
      if (params.id) {
        await prefillInputs(
          statusMsg,
          params.id,
          setDaoName,
          setDaoDescr,
          setSharePrice,
          setLogoUrl,
          setSocialMediaUrl,
          setCentralEscrow,
          setCustomerEscrow,
          setInvestingEscrow,
          setLockingEscrow,
          setOwner
        );
      }
    }
    prefill();
  }, [params.id, statusMsg]);

  const body = () => {
    return (
      <div>
        <div className="subtitle">{"Update dao data"}</div>
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
        <LabeledCurrencyInput
          label={"Share price per unit"}
          inputValue={sharePrice}
          onChange={(input) => setSharePrice(input)}
        />
        <LabeledInput
          label={"Logo URL (optional)"}
          inputValue={logoUrl}
          onChange={(input) => setLogoUrl(input)}
        />
        <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          onChange={(input) => setSocialMediaUrl(input)}
        />
        <LabeledInput
          label={"Funds escrow address"}
          inputValue={centralEscrow}
          onChange={(input) => setCentralEscrow(input)}
        />
        <LabeledInput
          label={"Payments escrow address"}
          inputValue={customerEscrow}
          onChange={(input) => setCustomerEscrow(input)}
        />
        <LabeledInput
          label={"Investing escrow address"}
          inputValue={investingEscrow}
          onChange={(input) => setInvestingEscrow(input)}
        />
        <LabeledInput
          label={"Locking escrow address"}
          inputValue={lockingEscrow}
          onChange={(input) => setLockingEscrow(input)}
        />
        <LabeledInput
          label={"Project owner"}
          inputValue={owner}
          onChange={(input) => setOwner(input)}
        />

        <button
          className="button__submit"
          onClick={() =>
            updateDaoData(statusMsg, showProgress, {
              dao_id: params.id,
              owner: owner,

              central_escrow: centralEscrow,
              customer_escrow: customerEscrow,
              investing_escrow: investingEscrow,
              locking_escrow: lockingEscrow,

              project_name: daoName,
              project_desc: daoDescr,
              share_price: sharePrice,

              logo_url: logoUrl,
              social_media_url: socialMediaUrl,
            })
          }
        >
          {"Update data"}
        </button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <ContentTitle title={"Settings"} />
        {body()}
      </div>
    </div>
  );
};
