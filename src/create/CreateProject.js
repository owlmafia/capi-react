import React, { useState, useEffect } from "react";
import { CreateProjectSuccess } from "./CreateProjectSuccess";
import { init, createProject } from "./controller";

export const CreateProject = (props) => {
  const [projectName, setProjectName] = useState("my1project");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [createProjectSuccess, setCreateProjectSuccess] = useState(null);

  console.log("props: " + JSON.stringify(props));

  useEffect(() => {
    init();
  }, []);

  const formView = () => {
    if (props.myAddress) {
      return (
        <div>
          <div className="input-label">{"Project name"}</div>
          <input
            placeholder=""
            className="full-width-input"
            size="64"
            value={projectName}
            onChange={(event) => {
              setProjectName(event.target.value);
            }}
          />
          {/* <div>{"Share asset name"}</div>
          <input
            placeholder=""
            className="full-width-input"
            size="10"
            value={shareName}
            onChange={(event) => {
              setShareName(event.target.value);
            }}
          /> */}
          <div className="input-label">{"Share supply"}</div>
          <input
            placeholder=""
            className="full-width-input"
            size="10"
            value={shareCount}
            onChange={(event) => {
              setShareCount(event.target.value);
            }}
          />
          <div className="input-label">{"Share price per unit (Algo)"}</div>
          <input
            placeholder=""
            className="full-width-input"
            size="10"
            value={sharePrice}
            onChange={(event) => {
              setSharePrice(event.target.value);
            }}
          />

          <button
            className="submit-button"
            disabled={
              props.myAddress === "" ||
              projectName === "" ||
              shareCount === "" ||
              sharePrice === ""
            }
            onClick={async () => {
              await createProject(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.setMyBalance,
                projectName,
                shareCount,
                sharePrice,
                setCreateProjectSuccess
              );
            }}
          >
            {"Create project"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const bodyView = () => {
    if (createProjectSuccess) {
      return (
        <CreateProjectSuccess
          project={createProjectSuccess}
          showModal={props.showModal}
        />
      );
    } else {
      return formView();
    }
  };

  return (
    <div>
      <div className="container">{bodyView()}</div>
    </div>
  );
};
