import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { init, checkForUpdates, updateApp } from "./controller";
import { UpdateDaoData } from "./UpdateDaoData";

export const Settings = ({ statusMsg, myAddress, showProgress }) => {
  let params = useParams();

  const [versionData, setVersionData] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      await init(statusMsg);
    }
    asyncInit();
  }, [statusMsg]);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await checkForUpdates(statusMsg, params.id, setVersionData);
      }
    }
    asyncInit();
  }, [statusMsg, params.id]);

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
        <div>
          <div>
            {"There's a new version: " +
              appVersionStr(
                updateData.new_approval_version,
                updateData.new_clear_version
              )}
          </div>
          <button
            className="button__submit"
            onClick={() =>
              updateApp(
                statusMsg,
                showProgress,
                params.id,
                myAddress,
                versionData.update_data.new_approval_version,
                versionData.update_data.new_clear_version
              )
            }
          >
            {"Update"}
          </button>
        </div>
      );
    } else {
      return <div>{"Your're up to date"}</div>;
    }
  };

  const body = () => {
    return (
      myAddress && (
        <div>
          {appVersionView()}
          <UpdateDaoData statusMsg={statusMsg} showProgress={showProgress} />
        </div>
      )
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

const appVersionStr = (approvalVersion, clearVersion) => {
  // For visual purposes, the "app version" contains both the approval and clear version
  // not important (for now?) that the user doesn't know what this means.
  return approvalVersion + "-" + clearVersion;
};