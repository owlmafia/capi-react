import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitButton } from "../common_comps/SubmitButton";
import { ContentTitle } from "../ContentTitle";
import { updateApp } from "./controller";
import { UpdateDaoData } from "./UpdateDaoData";

export const Settings = ({ deps }) => {
  let params = useParams();

  const [submitting, setSubmitting] = useState(false);

  const appVersionView = () => {
    return (
      deps.daoVersion && (
        <div className="section_large_bottom">
          <div>
            {"Current version: " +
              appVersionStr(
                deps.daoVersion.current_approval_version,
                deps.daoVersion.current_clear_version
              )}
          </div>

          {updateAppView(deps.daoVersion.update_data)}
        </div>
      )
    );
  };

  const updateAppView = (updateData) => {
    if (updateData) {
      return (
        <div id="update-app">
          <div className="d-flex align-center">
            {"There's a new version: " +
              appVersionStr(
                updateData.new_approval_version,
                updateData.new_clear_version
              )}

            <SubmitButton
              label={"Update"}
              className="button-primary ml-30"
              isLoading={submitting}
              onClick={async () => {
                await updateApp(
                  deps,
                  setSubmitting,
                  params.id,
                  deps.daoVersion.update_data.new_approval_version,
                  deps.daoVersion.update_data.new_clear_version,
                  deps.updateDaoVersion
                );
              }}
            />
          </div>
        </div>
      );
    } else {
      return <div>{"Your're up to date"}</div>;
    }
  };

  const body = () => {
    return (
      deps.myAddress && (
        <div>
          {appVersionView()}
          <UpdateDaoData deps={deps} />
        </div>
      )
    );
  };

  return (
    <div>
      <div>
        <ContentTitle title={"Project settings"} />
        {body()}
      </div>
    </div>
  );
};

const appVersionStr = (approvalVersion, clearVersion) => {
  // For visual purposes, the "app version" contains both the approval and clear version
  // not important (for now?) that the user doesn't know what this means.
  return approvalVersion + "-" + clearVersion;
};
