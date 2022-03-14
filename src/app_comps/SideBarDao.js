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
  updateMyBalance,
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
      <SidebarHeader>
        <div id="sidebar__header">
          {logoView(viewDao?.dao)}
          <MyAccount
            myAddress={myAddress}
            setMyAddress={setMyAddress}
            myAddressDisplay={myAddressDisplay}
            setMyAddressDisplay={setMyAddressDisplay}
            myBalance={myBalance}
            updateMyBalance={updateMyBalance}
            statusMsgUpdater={statusMsgUpdater}
            daoId={params.id}
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

const logoView = (dao) => {
  return <NavLink to="">{logoNestedView(dao)}</NavLink>;
};

const logoNestedView = (dao) => {
  console.log("dao???: %o", dao);
  if (dao?.logo_url) {
    return <img id="sidebar__logo" src={dao?.logo_url ?? ""} alt="Logo" />;
  } else if (dao?.name) {
    return <div id="sidebar__dao_name">{dao?.name}</div>;
  } else {
    return null;
  }
};
