import React, { useState, useEffect, useMemo } from "react";
import { init, fetchHolderCount } from "./controller";
import { ProjectName } from "../ContentTitle";
import { Link, useParams } from "react-router-dom";
import { InvestEmbedded } from "../investEmbedded/InvestEmbedded";
import { PayEmbedded } from "../payEmbedded/PayEmbedded";
import { Funds } from "./Funds";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { BsShare as ShareIcon } from "react-icons/bs";

var QRCode = require("qrcode.react");

export const Project = (props) => {
  let params = useParams();

  const [viewProject, setViewProject] = useState(null);
  const [funds, setFunds] = useState(null);

  const [holderCount, setHolderCount] = useState(null);

  const [showInvestTab, setShowInvestTab] = useState(false);
  const [showPayTab, setShowPayTab] = useState(false);

  console.log("props: " + JSON.stringify(props));

  const project = useMemo(() => {
    if (viewProject) {
      return viewProject.project;
    }
  }, [viewProject]);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading project id: " + JSON.stringify(params));
      await init(params.id, setViewProject, setFunds, props.statusMsg);
    }
    asyncInit();
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    if (project) {
      fetchHolderCount(
        props.statusMsg,
        project.shares_asset_id,
        setHolderCount
      );
    }
  }, [project]);

  const sharesAssetId = useMemo(() => {
    if (project) {
      return project.shares_asset_id;
    }
  }, [project]);

  const sharesSupply = useMemo(() => {
    if (project) {
      return project.share_supply;
    }
  }, [project]);

  const actions_tabs_classes = (tabIsShowing) => {
    var clazz = "link_button";
    if (tabIsShowing) {
      clazz += " project_action_tab_item__sel";
    }
    return clazz;
  };

  const projectView = () => {
    if (viewProject) {
      return (
        <div>
          <div className="container">
            <ProjectName project={viewProject.project}>
              <ShareIcon
                id="project_share"
                onClick={() => console.log("Share clicked!")}
              />
            </ProjectName>

            <div id="project_actions_top_bar">
              <p
                class={actions_tabs_classes(showInvestTab)}
                onClick={() => {
                  setShowPayTab(false);
                  setShowInvestTab((current) => !current);
                }}
              >
                {"Invest"}
              </p>
              <p
                class={actions_tabs_classes(showPayTab)}
                onClick={() => {
                  setShowInvestTab(false);
                  setShowPayTab((current) => !current);
                }}
              >
                {"Pay"}
              </p>
              <Funds
                funds={funds}
                amICreator={
                  props.myAddress &&
                  viewProject.project.creator_address &&
                  viewProject.project.creator_address === props.myAddress
                }
                projectId={params.id}
              />
            </div>
            {showInvestTab && (
              <InvestEmbedded
                showProgress={props.showProgress}
                statusMsg={props.statusMsg}
                setMyBalance={props.setMyBalance}
                myAddress={props.myAddress}
                project={project}
              />
            )}
            {showPayTab && (
              <PayEmbedded
                showProgress={props.showProgress}
                statusMsg={props.statusMsg}
                setMyBalance={props.setMyBalance}
                myAddress={props.myAddress}
                project={project}
              />
            )}
            {/* <Link
              disabled={props.myAddress === "" || funds === 0}
              hidden={viewProject.project.creator_address !== props.myAddress}
              to={"/withdraw/" + params.id}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
            <div className="section-spacer" />
            <SharesDistributionBox
              statusMsg={props.statusMsg}
              sharesAssetId={sharesAssetId}
              sharesSupply={sharesSupply}
              holderCount={holderCount}
            />

            <IncomeVsSpendingBox
              statusMsg={props.statusMsg}
              projectId={params.id}
            />
          </div>
          <div className="section-spacer" />
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
