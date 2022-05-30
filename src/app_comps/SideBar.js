import SideBarItem from "./SideBarItem";
import create from "../images/sidebar/create.svg";
import project from "../images/sidebar/projects.svg";
import logo from "../images/logo.svg";

export const SideBar = () => {
  return (
    <div className="sidebar-container">
      <div className="logo-container">
        <img src={logo} alt="logo" />
      </div>
      <SideBarItem imageSrc={create} route="/" label="Create" />
      <SideBarItem
        imageSrc={project}
        route="/my_projects"
        label="My Projects"
      />
    </div>
  );
};
