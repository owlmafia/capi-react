import { IoCreateOutline } from "react-icons/io5";
import { VscListFlat } from "react-icons/vsc";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";

export const SideBar = () => {
  return (
    <ProSidebar id="sidebar">
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem icon={<IoCreateOutline />}>
            <Link to="/">Create</Link>
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
