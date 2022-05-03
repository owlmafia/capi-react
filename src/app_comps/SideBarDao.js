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

export const SideBarDao = ({
  myAddress,
  statusMsgUpdater,
  myShares,
  updateMyShares,
}) => {
  let params = useParams();
  const [viewDao, setViewDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      await init(params.id, setViewDao, statusMsgUpdater);
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
          <MenuItem icon={<IoCreateOutline />}>
            <Link to="/global/create">Create</Link>
          </MenuItem>
          <MenuItem icon={<VscListFlat />}>
            <Link to="/global/my_projects">My projects</Link>
          </MenuItem>
        </Menu>
        <Menu iconShape="square">
          <MenuItem icon={<img src={home} alt="Home" />}>
            <NavLink to="">Project Home</NavLink>
          </MenuItem>
          <MenuItem icon={<FaRoad />}>
            <NavLink to="roadmap">Roadmap</NavLink>
          </MenuItem>
          <MenuItem icon={<IoMdStats />}>
            <NavLink to="stats">Stats</NavLink>
          </MenuItem>
          {myShares && myShares.total > 0 && (
            <MenuItem icon={<FaCoins />}>
              <NavLink to="investment">My investment</NavLink>
            </MenuItem>
          )}
          <MenuItem icon={<BsArrowUpCircle />}>
            <NavLink to="withdraw">Withdraw</NavLink>
          </MenuItem>
          <MenuItem icon={<VscArrowSwap />}>
            <NavLink to="funds_activity">Funds activity</NavLink>
          </MenuItem>
          <MenuItem icon={<FiSettings />}>
            <NavLink to="settings">Settings</NavLink>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        {viewDao && viewDao.dao && viewDao.dao.social_media_url && (
          <div className="social_media__container">
            <a
              href={viewDao.dao.social_media_url}
              target="_blank"
              rel="noreferrer"
              className="social_media__link"
            >
              Social media
            </a>
          </div>
        )}
      </SidebarFooter>
    </ProSidebar>
  );
};
