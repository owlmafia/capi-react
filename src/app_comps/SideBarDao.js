import React, { useEffect, useState } from "react";
import { BsArrowUpCircle } from "react-icons/bs";
import { FaAddressBook, FaCoins, FaRoad } from "react-icons/fa";
import { IoMdStats } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "react-pro-sidebar";
import { NavLink, useParams } from "react-router-dom";
import { init } from "./controller";
import { MyAccount } from "./MyAccount";

export const SideBarDao = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  setMyBalance,
  statusMsgUpdater,
  myShares,
  updateMyShares,
}) => {
  let params = useParams();
  const [viewProject, setViewProject] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      await init(params.id, setViewProject, statusMsgUpdater);
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
      <SidebarHeader>
        <div id="sidebar__header">
          <img
            id="sidebar__logo"
            src={viewProject?.project?.logo_url ?? ""}
            alt="Logo"
          />
          <MyAccount
            myAddress={myAddress}
            setMyAddress={setMyAddress}
            myAddressDisplay={myAddressDisplay}
            setMyAddressDisplay={setMyAddressDisplay}
            myBalance={myBalance}
            setMyBalance={setMyBalance}
            statusMsgUpdater={statusMsgUpdater}
            projectId={params.id}
            myShares={myShares}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<FaAddressBook />}>
            <NavLink to="">Home</NavLink>
          </MenuItem>
          <MenuItem icon={<FaRoad />}>
            <NavLink to="roadmap">Roadmap</NavLink>
          </MenuItem>
          <MenuItem icon={<IoMdStats />}>
            <NavLink to="stats">Stats</NavLink>
          </MenuItem>
          <MenuItem icon={<FaCoins />}>
            <NavLink to="investment">My investment</NavLink>
          </MenuItem>
          <MenuItem icon={<BsArrowUpCircle />}>
            <NavLink to="withdraw">Withdraw</NavLink>
          </MenuItem>
          <MenuItem icon={<VscArrowSwap />}>
            <NavLink to="funds_activity">Funds activity</NavLink>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        {viewProject &&
          viewProject.project &&
          viewProject.project.social_media_url && (
            <div className="social_media__container">
              <a
                href={viewProject.project.social_media_url}
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
