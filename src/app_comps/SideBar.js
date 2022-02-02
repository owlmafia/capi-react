import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "react-pro-sidebar";
import { FaHeart } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { VscListFlat } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { MyAccount } from "./MyAccount";

export const SideBar = ({
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
          <img id="sidebar__logo" src="/logo.svg" />
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
          <MenuItem icon={<IoCreateOutline />}>
            <Link to="create">Create</Link>
          </MenuItem>
          <MenuItem icon={<VscListFlat />}>
            <Link to="my_projects">My projects</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </ProSidebar>
  );
};
