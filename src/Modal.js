import * as ReactDOM from "react-dom";
import React from "react";
import close from "./images/svg/close.svg";
import facebook from "./images/svg/facebook.svg";
import linkedin from "./images/svg/linkedin.svg";
import twitter from "./images/svg/twitter-white.svg";
import instagram from "./images/svg/instagram.svg";
import discord from "./images/svg/discord.svg";

const Modal = ({ title, children, onCloseClick }) => {
  const onModalClick = (event) => {
    if (event.target === document.querySelector(".modal")) {
      onCloseClick();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal" onClick={onModalClick}>
      <div className="modal-content modal-content-size">
        <div className="modal-topbar">
          <p className="modal-topbar-title">Share at social media</p>
          <div className="modal-topbar-x" onClick={() => onCloseClick()}>
            <img src={close} alt="close" />
          </div>
        </div>
        <div className="modal-body">
          <div className="social-media-share facebook">
            <img src={facebook} alt="facebook" />
            <div>Share with Facebook</div>
          </div>
          <div className="social-media-share linkedin">
            <img src={linkedin} alt="linkedin" />
            <div>Share with LinkedIn</div>
          </div>
          <div className="social-media-share twitter">
            <img src={twitter} alt="twitter" />
            <div>Share with Twitter</div>
          </div>
          <div className="social-media-share instagram">
            <img src={instagram} alt="instagram" />
            <div>Share with Instagram</div>
          </div>
          <div className="social-media-share discord">
            <img src={discord} alt="discord" />
            <div>Share with Discord</div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
