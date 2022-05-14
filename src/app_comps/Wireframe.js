import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import logo from "../images/logo.svg";
import { RightCol } from "../right_col/RightCol";
import { RightDaoCol } from "../right_col/RightDaoCol";
import { init, initWithDaoId } from "./controller";
import { SideBar } from "./SideBar";
import { SideBarDao } from "./SideBarDao";
import { StatusMsgView } from "./StatusMsgView";
import twitter from "../images/svg/twitter.svg";
import share from "../images/svg/share.svg";
import Modal from "../Modal";
import ShareView from "./ShareView";

export const Wireframe = ({ isGlobal, deps }) => {
  let params = useParams();
  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await initWithDaoId(params.id, setDao, deps.statusMsg);
      } else {
        await init(deps.statusMsg);
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

const DaoTop = ({ dao }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <div>
      <div className="content-img">{logoView(dao)}</div>
      <div className="title-container">
        <div className="title">Crypticmonster: Unique NFT artworks</div>
        <div className="social-media-buttons">
          {dao.social_media_url && (
            <a href={dao.social_media_url} target="_blank" rel="noreferrer">
              <div className="share-icon button__follow">
                <img src={twitter} alt="logo-twitter" />
              </div>
            </a>
          )}
          <div className="share-icon">
            <img
              src={share}
              alt="share-icon"
              onClick={() => setShowShareModal((visible) => !visible)}
            />
          </div>
        </div>
      </div>
      {showShareModal && (
        <Modal
          title={"Share project"}
          onCloseClick={() => setShowShareModal(false)}
        >
          <ShareView projectUrl={"https://localhost:3000/123"} />
        </Modal>
      )}
    </div>
  );
};

const logoView = (dao) => {
  return (
    dao.image_url && (
      <img
        id="banner_img"
        class="content-img"
        src={dao.image_url ?? ""}
        alt="Project banner"
      />
    )
  );
};
