import React, { useEffect, useRef, useState } from "react";
import renderPieChart from "../charts/renderPieChart";
import { LabeledInput } from "../common_comps/LabeledInput";
import { ContentTitle } from "../ContentTitle";
import { createProject, init } from "./controller";
import { CreateProjectSuccess } from "./CreateProjectSuccess";

export const CreateProject = (props) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescr, setProjectDescr] = useState("");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [investorsShare, setInvestorsShare] = useState("40");
  const [logoUrl, setLogoUrl] = useState("");
  const [socialMediaUrl, setSocialMediaUrl] = useState("");
  const [createProjectSuccess, setCreateProjectSuccess] = useState(null);
  const investorsShareChart = useRef(null);

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
    // for now no deps - mutable value doesn't cause a re-render
    //   }, [investorsShare, investorsShareChart.current]);
  });

  const formView = () => {
    if (props.myAddress) {
      return (
        <div>
          <LabeledInput
            label={"Project name"}
            inputValue={projectName}
            onChange={(input) => setProjectName(input)}
          />
          <LabeledInput
            label={"Description"}
            inputValue={projectDescr}
            onChange={(input) => setProjectDescr(input)}
          />
          <LabeledInput
            label={"Share supply"}
            inputValue={shareCount}
            onChange={(input) => setShareCount(input)}
          />
          <LabeledInput
            label={"Share price per unit (Algo)"}
            inputValue={sharePrice}
            onChange={(input) => setSharePrice(input)}
          />

          <div className="chart__title">
            {"Investor's part: "}
            <p
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
            </p>
          </div>

          <div className="pie_chart__container input_spacing">
            <svg className="pie_chart__svg" ref={investorsShareChart} />
            <div className="pie_chart__centered_text">
              <input
                placeholder=""
                className="full_width_input"
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
              <span className="pie_chart__perc_symbol">{"%"}</span>
            </div>
          </div>

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
          <button
            className="button__submit"
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
                projectDescr,
                shareCount,
                sharePrice,
                investorsShare,
                logoUrl,
                socialMediaUrl,
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
      return <CreateProjectSuccess project={createProjectSuccess} />;
    } else {
      return (
        <div>
          <ContentTitle title="Create project" />
          {formView()}
        </div>
      );
    }
  };

  return <div>{bodyView()}</div>;
};
