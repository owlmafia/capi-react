import facebook from "../images/svg/facebook.svg";
import linkedin from "../images/svg/linkedin.svg";
import twitter from "../images/svg/twitter-white.svg";
import instagram from "../images/svg/instagram.svg";
import discord from "../images/svg/discord.svg";

const ShareView = () => {
  return (
    <div>
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
  );
};

export default ShareView;
