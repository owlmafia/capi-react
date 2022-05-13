import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { init } from "./controller";
import home from "../images/sidebar/home.svg";
import stats from "../images/sidebar/stats.svg";
import funds from "../images/sidebar/funds.svg";
import arrows from "../images/sidebar/funds-activity.svg";
import settings from "../images/sidebar/settings.svg";
import create from "../images/sidebar/create.svg";
import project from "../images/sidebar/projects.svg";
import SideBarItem from "./SiteBarItem";

export const SideBarDao = ({
  myAddress,
  statusMsgUpdater,
  myShares,
  updateMyShares,
}) => {
  let params = useParams();
  useEffect(() => {
    async function asyncInit() {
      await init(params.id);
    }
    asyncInit();
  }, [params.id, statusMsgUpdater]);

  useEffect(() => {
    async function asyncFn() {
      updateMyShares(params.id, myAddress);
    }
    if (myAddress) {
      asyncFn();
    }
  }, [params.id, myAddress, updateMyShares]);

  return (
    <div>
      <SideBarItem imageSrc={create} route="/" label="Create" />
      <SideBarItem
        imageSrc={project}
        route="/my_projects"
        label="My Projects"
      />
      <SideBarItem imageSrc={home} route="" label="Project Home" />
      <SideBarItem imageSrc={stats} route="stats" label="Stats" />
      {myShares && myShares.total > 0 && (
        <SideBarItem
          imageSrc={funds}
          route="investment"
          label="My Investment"
        />
      )}
      <SideBarItem imageSrc={funds} route="withdraw" label="Withdraw" />
      <SideBarItem
        imageSrc={arrows}
        route="funds_activity"
        label="Funds activity"
      />
      <SideBarItem imageSrc={settings} route="settings" label="Settings" />
    </div>
  );
};
