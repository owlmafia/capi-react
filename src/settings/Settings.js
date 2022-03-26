import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { init, updateApp } from "./controller";
import { UpdateDaoData } from "./UpdateDaoData";

export const Settings = ({ statusMsg, myAddress, showProgress }) => {
  let params = useParams();

  useEffect(() => {
    async function asyncInit() {
      await init(statusMsg);
    }
    asyncInit();
  }, [statusMsg]);

  const body = () => {
    return (
      myAddress && (
        <div>
          <div className="subtitle">{"Update app"}</div>
          <button
            className="button__submit"
            onClick={() => updateApp(statusMsg, params.id, myAddress, "1")}
          >
            {"Update"}
          </button>

          <div className="subtitle">{"Update project data"}</div>
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
