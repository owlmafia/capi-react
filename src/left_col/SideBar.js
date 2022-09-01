import SideBarItem from "./SideBarItem";
import create from "../images/sidebar/create.svg";
import project from "../images/sidebar/projects.svg";
import logo from "../images/logo.svg";
import { useState } from "react";
import { DevSettingsModal } from "../dev_settings/DevSettingsModal";
import { AppVersion } from "./AppVersion";

export const SideBar = ({ deps, containerClass }) => {
  const [devSettingsModal, setDevSettingsModal] = useState(false);

  return (
    <div className={containerClass}>
      <div className="logo-container">
        <img src={logo} alt="logo" />
      </div>
      <SideBarItem imageSrc={create} route="/" label="Create" />
      <SideBarItem
        imageSrc={project}
        route="/my_projects"
        label="My Projects"
      />
      {deps.features.developer && (
        <div className="clickable" onClick={() => setDevSettingsModal(true)}>
          {"Dev settings"}
        </div>
      )}
      {deps.features.developer && <AppVersion deps={deps} />}
      {devSettingsModal && (
        <DevSettingsModal
          deps={deps}
          closeModal={() => setDevSettingsModal(false)}
        />
      )}
    </div>
  );
};
