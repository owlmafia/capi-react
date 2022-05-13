import SideBarItem from "./SiteBarItem";
import create from "../images/sidebar/create.svg";
import project from "../images/sidebar/projects.svg";

export const SideBar = () => {
  return (
    <div>
      <SideBarItem imageSrc={create} route="/" label="Create" />
      <SideBarItem
        imageSrc={project}
        route="/my_projects"
        label="My Projects"
      />
    </div>
  );
};
