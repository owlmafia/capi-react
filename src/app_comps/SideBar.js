import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarContent,
  SidebarHeader,
} from "react-pro-sidebar";
import { FaGem, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

export const SideBar = () => {
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
    </ProSidebar>
  );
};
