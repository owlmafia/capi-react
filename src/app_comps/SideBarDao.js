import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import home from "../images/sidebar/home.svg";
import stats from "../images/sidebar/stats.svg";
import funds from "../images/sidebar/funds.svg";
import arrows from "../images/sidebar/funds-activity.svg";
import settings from "../images/sidebar/settings.svg";
import create from "../images/sidebar/create.svg";
import project from "../images/sidebar/projects.svg";
import SideBarItem from "./SideBarItem";

export const SideBarDao = ({ deps }) => {
  let params = useParams();

  useEffect(() => {
    async function asyncFn() {
      deps.updateMyShares.call(null, params.id, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [params.id, deps.myAddress, deps.updateMyShares]);

  return (
    <div className="sidebar-container">
      <SideBarItem imageSrc={create} route="/" label="Create" />
      <SideBarItem
        imageSrc={project}
        route="/my_projects"
        label="My Projects"
      />
      <SideBarItem imageSrc={home} route="" label="Project Home" />
      <SideBarItem imageSrc={stats} route="stats" label="Stats" />
      {deps.myShares && deps.myShares.total > 0 && (
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
