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

export const Wireframe = ({
  isGlobal,
  statusMsg,

  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,

  myShares,
  updateMyShares,
  myDividend,
  updateMyDividend,
  showProgress,
  updateInvestmentData,
  funds,
  updateFunds,
  fundsChange,
}) => {
  let params = useParams();
  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await initWithDaoId(params.id, setDao, statusMsgUpdater);
      } else {
        await init(statusMsgUpdater);
      }
    }
    asyncInit();
  }, [params.id, statusMsgUpdater]);

  const sideBar = () => {
    if (isGlobal) {
      return <SideBar />;
    } else {
      return (
        <SideBarDao
          myAddress={myAddress}
          statusMsgUpdater={statusMsgUpdater}
          myShares={myShares}
          updateMyShares={updateMyShares}
        />
      );
    }
  };

  const rightCol = () => {
    if (isGlobal) {
      //   return null;
      return (
        <RightCol
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          myAddressDisplay={myAddressDisplay}
          setMyAddressDisplay={setMyAddressDisplay}
          myBalance={myBalance}
          updateMyBalance={updateMyBalance}
          statusMsgUpdater={statusMsgUpdater}
          updateMyShares={updateMyShares}
        />
      );
    } else {
      return (
        <RightDaoCol
          myAddress={myAddress}
          setMyAddress={setMyAddress}
          myAddressDisplay={myAddressDisplay}
          setMyAddressDisplay={setMyAddressDisplay}
          myBalance={myBalance}
          updateMyBalance={updateMyBalance}
          statusMsgUpdater={statusMsgUpdater}
          updateMyShares={updateMyShares}
          myDividend={myDividend}
          updateMyDividend={updateMyDividend}
          showProgress={showProgress}
          updateInvestmentData={updateInvestmentData}
          funds={funds}
          updateFunds={updateFunds}
          fundsChange={fundsChange}
        />
      );
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
        {statusMsg && (
          <StatusMsgView
            statusMsgUpdater={statusMsgUpdater}
            statusMsg={statusMsg}
          />
        )}
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
              <button className="button__follow">
                <img width="20" height="16" src={twitter} alt="logo-twitter" />
                Follow on Twitter
              </button>
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
          title={"Share dao"}
          onCloseClick={() => setShowShareModal(false)}
        >
          <div>{"TODO Social media buttons to share this dao"}</div>
        </Modal>
      )}
    </div>
  );
};

const logoView = (dao) => {
  return (
    dao.image_url && (
      <img id="banner_img" src={dao.image_url ?? ""} alt="Project banner" />
    )
  );
};
