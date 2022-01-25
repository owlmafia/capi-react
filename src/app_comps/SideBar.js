import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "react-pro-sidebar";
import { FaGem, FaHeart } from "react-icons/fa";
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
          <div
            style={{
              backgroundColor: "red",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<FaGem />}>
            <Link to="create">Create</Link>
          </MenuItem>
          <MenuItem icon={<FaHeart />}>
            <Link to="my_projects">My projects</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <MyAccount
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          myAddressDisplay={myAddressDisplay}
          setMyAddressDisplay={setMyAddressDisplay}
          myBalance={myBalance}
          setMyBalance={setMyBalance}
          statusMsgUpdater={statusMsgUpdater}
        />
      </SidebarFooter>
    </ProSidebar>
  );
};
