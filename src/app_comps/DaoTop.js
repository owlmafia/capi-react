import twitter from "../images/svg/twitter.svg";
import share from "../images/svg/share.svg";
import Modal from "../Modal";
import ShareView from "./ShareView";
import React, { useState } from "react";

export const DaoTop = ({ dao }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <div>
      <div>{logoView(dao)}</div>
      <div className="title-container">
        <div className="title">Crypticmonster: Unique NFT artworks</div>
        <div className="social-media-buttons">
          {dao.social_media_url && (
            <a href={dao.social_media_url} target="_blank" rel="noreferrer">
              <div className="button__follow share-icon">
                <img src={twitter} alt="logo-twitter" />
              </div>
            </a>
          )}
          <div className="button-share share-icon">
            <img
              src={share}
              alt="share-icon"
              onClick={() => setShowShareModal((visible) => !visible)}
            />
          </div>
        </div>
      </div>
      {showShareModal && dao && (
        <Modal
          title={"Share project"}
          onCloseClick={() => setShowShareModal(false)}
        >
          <ShareView projectUrl={projectUrl(dao.app_id)} />
        </Modal>
      )}
    </div>
  );
};

const logoView = (dao) => {
  return (
    dao.image_url && (
      <div
        className="content-img"
        style={{ backgroundImage: `url(${dao.image_url})` }}
      ></div>
    )
  );
};

const projectUrl = (daoId) => {
  return window.location.protocol + "//" + window.location.host + "/" + daoId;
};
