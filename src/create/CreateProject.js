import React, { useState, useEffect } from "react";
import { CreateProjectSuccess } from "./CreateProjectSuccess";
import { init, createProject } from "./controller";

export const CreateProject = (props) => {
  const [projectName, setProjectName] = useState("");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [investorsShare, setInvestorsShare] = useState("40");
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
            size="30"
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
          <div className="input-label">
            {"Investor's part: "}
            <a
              href="#"
              onClick={() =>
                props.showModal({
                  title: "Investor's share",
                  body: (
                    <div>
                      <p>
                        {"The % of the project's income reserved to investors"}
                      </p>
                      <p>
                        {
                          "Note that you can borrow from this income, if enough investors vote for it."
                        }
                      </p>
                    </div>
                  ),
                })
              }
            >
              ?
            </a>
          </div>
          <input
            placeholder=""
            className="full-width-input"
            size="10"
            value={investorsShare}
            onChange={(event) => {
              setInvestorsShare(event.target.value);
            }}
          />

          <button
            className="submit-button"
            disabled={
              props.myAddress === "" ||
              projectName === "" ||
              shareCount === "" ||
              sharePrice === "" ||
              investorsShare === ""
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
                investorsShare,
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
