import { useState } from "react";
import { useParams } from "react-router-dom";
import { LabeledInput, LabeledTextArea } from "../common_comps/LabeledInput";
import { SubmitButton } from "../common_comps/SubmitButton";
import { addTeamMember } from "./controller";

export const AddTeamMember = ({
  deps,
  prefillData,
  team,
  setTeam,
  onAdded,
}) => {
  let params = useParams();

  const [name, setName] = useState(prefillData.name);
  const [role, setRole] = useState(prefillData.role);
  const [descr, setDescr] = useState(prefillData.descr);
  const [picture, setPicture] = useState(prefillData.picture);
  const [social, setSocial] = useState(prefillData.social);

  const [submitting, setSubmitting] = useState(false);

  const [nameError, setNameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [descrError, setDescrError] = useState("");
  const [pictureError, setPictureError] = useState("");
  const [socialError, setSocialError] = useState("");

  const contentView = () => {
    return (
      <div>
        <LabeledInput
          label={"Name"}
          inputValue={name}
          onChange={(input) => setName(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={nameError}
        />
        <LabeledInput
          label={"Role"}
          inputValue={role}
          onChange={(input) => setRole(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={roleError}
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={descr}
          onChange={(input) => setDescr(input)}
          maxLength={2000} // NOTE: has to match WASM
          errorMsg={descrError}
        />
        <LabeledInput
          label={"Picture"}
          inputValue={picture}
          onChange={(input) => setPicture(input)}
          maxLength={100}
          errorMsg={pictureError}
        />
        <LabeledInput
          label={"Social"}
          inputValue={social}
          onChange={(input) => setSocial(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={socialError}
        />

        <SubmitButton
          label={"Submit"}
          isLoading={submitting}
          className="button-primary w-100"
          onClick={async () => {
            await addTeamMember(
              deps.statusMsg,
              deps.wallet,

              setSubmitting,

              params.id,
              deps.myAddress,

              name,
              role,

              descr,
              picture,
              social,
              team,
              setTeam,

              setNameError,
              setRoleError,
              setDescrError,
              setPictureError,
              setSocialError
            );

            onAdded();
          }}
        />
      </div>
    );
  };

  if (deps.myAddress) {
    return contentView();
  } else {
    return null;
  }
};
