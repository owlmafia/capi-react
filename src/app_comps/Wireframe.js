import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import logo from "../images/logo.svg";
import { RightCol } from "../right_col/RightCol";
import { RightDaoCol } from "../right_col/RightDaoCol";
import { initWithDaoId } from "./controller";
import { DaoTop } from "./DaoTop";
import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { StatusMsgView } from "./StatusMsgView";

export const Wireframe = ({ isGlobal, deps }) => {
  let params = useParams();
  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await initWithDaoId(params.id, setDao, deps.statusMsg);
      }
    }
    asyncInit();
  }, [params.id, deps.statusMsg]);

  const sideBar = () => {
    if (isGlobal) {
      return <SideBar />;
    } else {
      return <SideBarDao deps={deps} />;
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
    return !isGlobal && dao && <DaoTop dao={dao} />;
  };

  return (
    <div id="nav_and_main">
      <div className="logo-container">
        <img src={logo} alt="logo" />
      </div>
      {sideBar()}
      <div id="content">
        {deps.statusMsgDisplay && <StatusMsgView deps={deps} />}
        {daoTop()}
        <Outlet />
      </div>
      {rightCol()}
    </div>
  );
};
