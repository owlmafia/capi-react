import { Outlet } from "react-router-dom";
import { RightCol } from "../right_col/RightCol";
import { RightDaoCol } from "../right_col/RightDaoCol";
import { DaoTop } from "../common_comps/DaoTop";
import { SideBar } from "../left_col/SideBar";
import { SideBarDao } from "../left_col/SideBarDao";

export const Wireframe = ({ isGlobal, deps }) => {
  const sideBar = () => {
    if (isGlobal) {
      return <SideBar deps={deps} containerClass={"sidebar-container"} />;
    } else {
      return <SideBarDao deps={deps} containerClass={"sidebar-container"} />;
    }
  };

  const rightCol = () => {
    if (isGlobal) {
      return <RightCol deps={deps} />;
    } else {
      return <RightDaoCol deps={deps} />;
    }
  };

  const daoTop = () => {
    return !isGlobal && deps.dao && <DaoTop dao={deps.dao} />;
  };

  return (
    <div id="nav_and_main">
      {sideBar()}
      <div id="content">
        {daoTop()}
        <Outlet />
      </div>
      {rightCol()}
    </div>
  );
};
