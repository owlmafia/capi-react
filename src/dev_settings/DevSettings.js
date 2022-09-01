import { useState } from "react";
import {
  saveDevSettingCapiAddress,
  saveDevSettingFundsAssetId,
} from "../modal/storage";
import { LabeledInput } from "../common_comps/LabeledInput";
import { SubmitButton } from "../common_comps/SubmitButton";
import { setDevSettings } from "./controller";
import { useParams } from "react-router-dom";

export const DevSettings = ({ deps, closeModal }) => {
  let params = useParams();

  const [fundsAssetId, setFundsAssetId] = useState("");
  const [capiAddress, setCapiAddress] = useState("");

  const [minRaiseTargetEndDate, setMinRaiseTargetEndDate] = useState("");
  const [submittingDevSettings, setSubmittingDevSettings] = useState(false);

  return (
    <div>
      <div>{"Enter data displayed when network_test_util completes."}</div>
      <div>
        {
          "This has to be done every time network_test_util generates new/different values OR after clearing the browser's cache"
        }
      </div>
      <div className="mb-20">
        {"If you make a mistake, just submit it again, and refresh."}
      </div>
      <LabeledInput
        label={"Funds asset id"}
        inputValue={fundsAssetId}
        onChange={(input) => setFundsAssetId(input)}
      />
      <LabeledInput
        label={"Capi address"}
        inputValue={capiAddress}
        onChange={(input) => setCapiAddress(input)}
      />
      <SubmitButton
        label={"Submit"}
        className={"button-primary"}
        disabled={fundsAssetId === "" || capiAddress === ""}
        onClick={async () => {
          saveDevSettingCapiAddress(capiAddress);
          saveDevSettingFundsAssetId(fundsAssetId);
          closeModal();
        }}
      />

      <div>{"Danger zone: manual smart contract modifications"}</div>
      <div>
        {
          "Use if needed for specific tests. To revert to regular app behavior, create a new dao (or reset the network)"
        }
      </div>
      <div>
        {
          "NOTE: YOU'VE TO BE CONNECTED AND ON A DAO (DAO ID IN URL) TO UPDATE DAO SETTINGS"
        }
      </div>
      <div>{"See console for logs / results."}</div>
      <LabeledInput
        label={"Change funds raising end date (Unix timestamp in seconds)"}
        inputValue={minRaiseTargetEndDate}
        onChange={(input) => setMinRaiseTargetEndDate(input)}
      />
      <SubmitButton
        label={"Submit (danger)"}
        className={"button-primary"}
        isLoading={submittingDevSettings}
        disabled={minRaiseTargetEndDate === ""}
        onClick={async () => {
          setDevSettings(
            deps,
            params.id,
            setSubmittingDevSettings,
            minRaiseTargetEndDate
          );
          closeModal();
        }}
      />
    </div>
  );
};
