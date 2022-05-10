import React, { useEffect, useState } from "react";
import { BsArrowUpCircle } from "react-icons/bs";
import { FaCoins, FaRoad } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { IoMdStats } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";
import { IoCreateOutline } from "react-icons/io5";
import { VscListFlat } from "react-icons/vsc";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import { NavLink, useParams, Link } from "react-router-dom";
import { init } from "./controller";
import home from "../images/sidebar/home.svg";
import stats from "../images/sidebar/stats.svg";
import funds from "../images/sidebar/funds.svg";
import arrows from "../images/sidebar/funds-activity.svg";
import settings from "../images/sidebar/settings.svg";
import create from "../images/sidebar/create.svg";
import project from "../images/sidebar/projects.svg";

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
    <ProSidebar id="sidebar">
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<img src={create} alt="create" />}>
            <Link to="/">Create</Link>
          </MenuItem>
          <MenuItem icon={<img src={project} alt="project" />}>
            <Link to="/my_projects">My projects</Link>
          </MenuItem>
        </Menu>
        <Menu iconShape="square">
          <MenuItem icon={<img src={home} alt="Home" />}>
            <NavLink to="">Project Home</NavLink>
          </MenuItem>
          <MenuItem icon={<img src={stats} alt="stats" />}>
            <NavLink to="stats">Stats</NavLink>
          </MenuItem>
          {myShares && myShares.total > 0 && (
            <MenuItem icon={<img src={funds} alt="funds" />}>
              <NavLink to="investment">My investment</NavLink>
            </MenuItem>
          )}
          <MenuItem icon={<img src={funds} alt="funds" />}>
            <NavLink to="withdraw">Withdraw</NavLink>
          </MenuItem>
          <MenuItem icon={<img src={arrows} alt="arrows" />}>
            <NavLink to="funds_activity">Funds activity</NavLink>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <MenuItem icon={<img src={settings} alt="settings" />}>
          <NavLink to="settings">Settings</NavLink>
        </MenuItem>
      </SidebarFooter>
    </ProSidebar>
  );
};
