import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { init, checkForUpdates, updateApp } from "./controller";
import { UpdateDaoData } from "./UpdateDaoData";

export const Settings = ({ deps }) => {
  let params = useParams();

  const [versionData, setVersionData] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      await init(deps.statusMsg);
    }
    asyncInit();
  }, [deps.statusMsg]);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await checkForUpdates(deps.statusMsg, params.id, setVersionData);
      }
    }
    asyncInit();
  }, [deps.statusMsg, params.id]);

  const appVersionView = () => {
    return (
      versionData && (
        <div className="section_large_bottom">
          <div>
            {"Current version: " +
              appVersionStr(
                versionData.current_approval_version,
                versionData.current_clear_version
              )}
          </div>

          {updateAppView(versionData.update_data)}
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
            <button
              className="button-primary"
              onClick={() =>
                updateApp(
                  deps.statusMsg,
                  deps.showProgress,
                  params.id,
                  deps.myAddress,
                  versionData.update_data.new_approval_version,
                  versionData.update_data.new_clear_version
                )
              }
            >
              {"Update"}
            </button>
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
          <UpdateDaoData
            statusMsg={deps.statusMsg}
            showProgress={deps.showProgress}
          />
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
