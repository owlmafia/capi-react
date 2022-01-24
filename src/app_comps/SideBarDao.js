import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaAddressBook, FaAnchor } from "react-icons/fa";

export const SideBarDao = () => {
  return (
    <ProSidebar>
      <SidebarHeader>
        <div
          style={{
            height: "80px",
            padding: "50px 20px 50px 20px",
          }}
        >
          <div
            style={{
              backgroundColor: "blue",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<FaAddressBook />}>
            <Link to="">Home</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="roadmap">Roadmap</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="stats">Stats</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="investment">My investment</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="withdraw">Withdraw</Link>
          </MenuItem>
          <MenuItem icon={<FaAnchor />}>
            <Link to="withdrawal_history">Funds activity</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};
