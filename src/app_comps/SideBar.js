import { IoCreateOutline } from "react-icons/io5";
import { VscListFlat } from "react-icons/vsc";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { MyAccount } from "./MyAccount";

export const SideBar = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,
}) => {
  return (
    <ProSidebar id="sidebar">
      <SidebarHeader>
        <div id="sidebar__header">
          <img id="sidebar__logo" src="/logo.svg" alt="Logo" />
          <MyAccount
            myAddress={myAddress}
            setMyAddress={setMyAddress}
            myAddressDisplay={myAddressDisplay}
            setMyAddressDisplay={setMyAddressDisplay}
            myBalance={myBalance}
            updateMyBalance={updateMyBalance}
            statusMsgUpdater={statusMsgUpdater}
            // no dao here
            daoId={null}
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
