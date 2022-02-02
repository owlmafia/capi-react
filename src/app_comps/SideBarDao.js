import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "react-pro-sidebar";
import { Link, NavLink } from "react-router-dom";
import { FaAddressBook, FaRoad, FaCoins } from "react-icons/fa";
import { MyAccount } from "./MyAccount";
import { BsArrowUpCircle } from "react-icons/bs";
import { IoMdStats } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";

export const SideBarDao = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  setMyBalance,
  statusMsgUpdater,
}) => {
  return (
    <ProSidebar id="sidebar">
      <SidebarHeader>
        <div id="sidebar__header">
          <img id="sidebar__logo" />
          <MyAccount
            myAddress={myAddress}
            setMyAddress={setMyAddress}
            myAddressDisplay={myAddressDisplay}
            setMyAddressDisplay={setMyAddressDisplay}
            myBalance={myBalance}
            setMyBalance={setMyBalance}
            statusMsgUpdater={statusMsgUpdater}
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
      <SidebarFooter></SidebarFooter>
    </ProSidebar>
  );
};
