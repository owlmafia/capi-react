import React, { useEffect, useMemo, useState, useCallback } from "react";
import { BsShare as ShareIcon } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { fetchHolderCount } from "../common_functions/stats_common";
import { ProjectName } from "../ContentTitle";
import { FundsActivityEmbedded } from "../funds_activity/FundsActivityEmbedded";
import { InvestEmbedded } from "../investEmbedded/InvestEmbedded";
import { PayEmbedded } from "../payEmbedded/PayEmbedded";
import { init, updateFunds_ } from "./controller";
import { Funds } from "./Funds";
import Modal from "../Modal";

export const Project = (props) => {
  let params = useParams();

  const [viewProject, setViewProject] = useState(null);
  const [funds, setFunds] = useState(null);

  const [holderCount, setHolderCount] = useState(null);

  const [showInvestTab, setShowInvestTab] = useState(false);
  const [showPayTab, setShowPayTab] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);

  console.log("props: " + JSON.stringify(props));

  const project = useMemo(() => {
    if (viewProject) {
      return viewProject.project;
    }
  }, [viewProject]);

  const updateFunds = useCallback(async () => {
    await updateFunds_(params.id, setViewProject, setFunds, props.statusMsg);
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    async function asyncInit() {
      await init(params.id, setViewProject, setFunds, props.statusMsg);
    }
    asyncInit();
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    if (project) {
      fetchHolderCount(
        props.statusMsg,
        project.shares_asset_id,
        project.investing_escrow_address,
        project.locking_escrow_address,
        setHolderCount
      );
    }
  }, [props.statusMsg, project]);

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
          <div>
            <ProjectName project={viewProject.project}>
              <ShareIcon
                className="title_right_button"
                onClick={() => setShowShareModal((visible) => !visible)}
              />
            </ProjectName>

            <div id="project_description">
              {viewProject.project.description}
            </div>

            <div id="project_actions_top_bar">
              <p
                className={actions_tabs_classes(showInvestTab)}
                onClick={() => {
                  setShowPayTab(false);
                  setShowInvestTab((current) => !current);
                }}
              >
                {"Invest"}
              </p>
              <p
                className={actions_tabs_classes(showPayTab)}
                onClick={() => {
                  setShowInvestTab(false);
                  setShowPayTab((current) => !current);
                }}
              >
                {"Pay"}
              </p>
              <Funds
                funds={funds}
                showWithdrawLink={
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
                updateMyBalance={props.updateMyBalance}
                myAddress={props.myAddress}
                project={project}
                updateMyShares={props.updateMyShares}
                myShares={props.myShares}
                updateFunds={updateFunds}
              />
            )}
            {showPayTab && (
              <PayEmbedded
                showProgress={props.showProgress}
                statusMsg={props.statusMsg}
                updateMyBalance={props.updateMyBalance}
                myAddress={props.myAddress}
                project={project}
                updateFunds={updateFunds}
              />
            )}
            <FundsActivityEmbedded
              statusMsg={props.statusMsg}
              projectId={params.id}
              myAddress={props.myAddress}
            />
            {/* <Link
              disabled={props.myAddress === "" || funds === 0}
              hidden={viewProject.project.creator_address !== props.myAddress}
              to={"/withdraw/" + params.id}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
            <div className="section-spacer" />
            {project && (
              <SharesDistributionBox
                statusMsg={props.statusMsg}
                sharesAssetId={sharesAssetId}
                sharesSupply={sharesSupply}
                holderCount={holderCount}
                appId={project.central_app_id}
                investingEscrowAddress={project.investing_escrow_address}
                lockingEscrowAddress={project.locking_escrow_address}
              />
            )}

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
      {projectView()}
      {showShareModal && (
        <Modal
          title={"Share project"}
          onCloseClick={() => setShowShareModal(false)}
        >
          <div>{"TODO Social media buttons to share this project"}</div>
        </Modal>
      )}
    </div>
  );
};
