import React, { useState, useEffect, useRef } from "react";
import { CreateProjectSuccess } from "./CreateProjectSuccess";
import { init, createProject } from "./controller";
import renderPieChart from "../charts/renderPieChart";
import { ContentTitle } from "../ContentTitle";

export const CreateProject = (props) => {
  const [projectName, setProjectName] = useState("");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [investorsShare, setInvestorsShare] = useState("40");
  const [createProjectSuccess, setCreateProjectSuccess] = useState(null);
  const investorsShareChart = useRef(null);

  console.log("props: " + JSON.stringify(props));

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (investorsShareChart.current) {
      // investors share % expected to be 0-100 (user input)
      // note that this text currently isn't validated and can be anything - the d3 chart shows the last valid data, no errors.
      const nonInvestorsShare = 100 - investorsShare;
      // the labels are irrelevant here
      const data = { a: investorsShare, b: nonInvestorsShare };
      renderPieChart(investorsShareChart.current, data, (d) => d[1]);
    }
  }, [investorsShare, investorsShareChart.current]);

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
                    </div>
                  ),
                })
              }
            >
              ?
            </a>
          </div>

          <div className="relative_pos">
            <div>
              <svg width={200} height={200} ref={investorsShareChart} />
            </div>
            <div className="centered_overlay">
              <input
                placeholder=""
                className="full-width-input"
                size="10"
                value={investorsShare}
                style={{
                  width: "70px",
                  textAlign: "center",
                  margin: "0",
                }}
                onChange={(event) => {
                  setInvestorsShare(event.target.value);
                }}
              />
              <span className="perc_symbol_in_pie_chart">{"%"}</span>
            </div>
          </div>

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
      return (
        <div>
          <ContentTitle title="Create project" />
          {formView()};
        </div>
      );
    }
  };

  return (
    <div>
      <div className="container">{bodyView()}</div>
    </div>
  );
};
