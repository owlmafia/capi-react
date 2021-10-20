import React, { useState, useEffect } from "react";
import { init, invest, stake } from "./controller";

export const Invest = (props) => {
  const [project, setProject] = useState(null);
  const [buySharesCount, setBuySharesCount] = useState("");
  const [investorCurrentSharesCount, setInvestorCurrentSharesCount] =
    useState("");

  console.log("props: " + JSON.stringify(props));

  useEffect(() => {
    //   console.log("loading project id: " + JSON.stringify(props.match.params));
    init(
      props.match.params.id,
      props.myAddress,
      props.statusMsg,
      setProject,
      setInvestorCurrentSharesCount
    );
  }, [props.match.params.id, props.statusMsg, props.myAddress]);

  const yourFreeSharesView = () => {
    // if (investorCurrentSharesCount !== "") {
    if (props.myAddress) {
      return <p>{"Unstaked shares: " + investorCurrentSharesCount}</p>;
    } else {
      return null;
    }
  };

  const projectView = () => {
    if (project) {
      return (
        <div>
          <div className="container">
            <p>{"Project name:"}</p>
            <a href={project.project_link} target="_blank" rel="noreferrer">
              {project.name}
            </a>
            <p>{"Share supply:"}</p>
            {project.share_supply}
            <p>{"Share asset name:"}</p>
            {project.share_asset_name}
            <p>{"Share asset id:"}</p>
            <a
              href={
                "https://testnet.algoexplorer.io/asset/" +
                project.share_asset_id
              }
              target="_blank"
              rel="noreferrer"
            >
              {project.share_asset_id}
            </a>
            <p>{"Share price:"}</p>
            {project.share_price}
            <p>{"Vote threshold:"}</p>
            {project.vote_threshold}
            <div>
              <div className="input-row">
                <button
                  disabled={props.myAddress === ""}
                  onClick={async (_) => {
                    await invest(
                      props.myAddress,
                      props.showProgress,
                      props.statusMsg,
                      props.showModal,
                      props.history,
                      props.match.params.id,
                      project,
                      buySharesCount
                    );
                  }}
                >
                  {"Buy"}
                </button>
                <input
                  placeholder={""}
                  className="inline"
                  size="16"
                  value={buySharesCount}
                  onChange={(event) => {
                    setBuySharesCount(event.target.value);
                  }}
                />
                <span>{"Shares"}</span>
                {/* <p>{"(" + (project.sh) + ")"}</p> */}

                <br />
                {yourFreeSharesView()}
                <button
                  disabled={
                    props.myAddress === "" || investorCurrentSharesCount === 0
                  }
                  onClick={async () => {
                    await stake(
                      props.myAddress,
                      props.showProgress,
                      props.statusMsg,
                      props.showModal,
                      setProject,
                      props.history,
                      props.match.params.id,
                      project
                    );
                  }}
                >
                  {"Stake"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{projectView()}</div>
    </div>
  );
};
