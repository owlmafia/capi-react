import React, { useState, useEffect } from "react";
import { init, invest, stake } from "./controller";
import { ProjectName } from "../ContentTitle";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export const Invest = (props) => {
  let params = useParams();

  const [project, setProject] = useState(null);
  const [buySharesCount, setBuySharesCount] = useState("");
  const [investorCurrentSharesCount, setInvestorCurrentSharesCount] =
    useState("");
  const [buySharesTotalPrice, setBuySharesTotalPrice] = useState("");

  console.log("props: " + JSON.stringify(props));

  useEffect(() => {
    //   console.log("loading project id: " + JSON.stringify(params));
    init(
      params.id,
      props.myAddress,
      props.statusMsg,
      setProject,
      setInvestorCurrentSharesCount
    );
  }, [params.id, props.statusMsg, props.myAddress]);

  const yourFreeSharesView = () => {
    // if (investorCurrentSharesCount !== "") {
    if (props.myAddress) {
      return <p>{"Free shares: " + investorCurrentSharesCount}</p>;
    } else {
      return null;
    }
  };

  const buyView = () => {
    if (props.myAddress && project) {
      return (
        <div>
          <div className="section-spacer" />
          <div className="input-label">{"Buy shares:"}</div>
          <input
            placeholder={""}
            className="inline"
            size="4"
            value={buySharesCount}
            onChange={(event) => {
              const input = event.target.value;
              if (!isNaN(input)) {
                const price = input * project.share_price_number_algo;
                setBuySharesTotalPrice(price + " Algo");
              }
              setBuySharesCount(event.target.value);
            }}
          />
          <span class="shares-total-price">{buySharesTotalPrice}</span>
          <div>
            <button
              disabled={props.myAddress === ""}
              onClick={async (_) => {
                await invest(
                  props.myAddress,
                  props.showProgress,
                  props.statusMsg,
                  props.setMyBalance,
                  props.showModal,
                  props.history,
                  params.id,
                  project,
                  buySharesCount
                );
              }}
            >
              {"Buy"}
            </button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const stakingView = () => {
    // if (investorCurrentSharesCount !== "") {
    if (investorCurrentSharesCount) {
      return (
        <div>
          <div className="section-spacer" />
          <div className="input-label">{"Or stake:"}</div>
          {yourFreeSharesView()}
          <button
            onClick={async () => {
              await stake(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.setMyBalance,
                props.showModal,
                setProject,
                props.history,
                params.id,
                project
              );
            }}
          >
            {"Stake"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const projectView = () => {
    if (project) {
      return (
        <div>
          <Link to={"/" + params.id + "/investment"}>
            {"Go to your investor site"}
          </Link>
          <div>
            <ProjectName project={project} />
            <p>
              <span className="key-val-key">{"Share supply:"}</span>
              <span className="key-val-val">{project.share_supply}</span>
            </p>
            <p>
              <span className="key-val-key">{"Share asset id:"}</span>
              <span className="key-val-val">
                {" "}
                <a
                  href={
                    "https://testnet.algoexplorer.io/asset/" +
                    project.shares_asset_id
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.shares_asset_id}
                </a>
              </span>
            </p>
            <p>
              <span className="key-val-key">{"Share price:"}</span>
              <span className="key-val-val">{project.share_price}</span>
            </p>

            <div>
              {buyView()}

              {/* <p>{"(" + (project.sh) + ")"}</p> */}
              {stakingView()}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return <div>{projectView()}</div>;
};
