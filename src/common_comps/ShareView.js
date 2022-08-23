import facebook from "../images/svg/facebook.svg";
import linkedin from "../images/svg/linkedin.svg";
import twitter from "../images/svg/twitter-white.svg";
import instagram from "../images/svg/instagram.svg";

const ShareView = ({ projectUrl }) => {
  const shareText = "Invest in my project!";

  return (
    <div className="modal-container">
      <div className="social-media-share facebook">
        <a href={facebookLink(projectUrl, shareText)}>
          <img src={facebook} alt="facebook" />
          <div className="title">Share with Facebook</div>
        </a>
      </div>
      <div className="social-media-share linkedin">
        <a href={linkedInLink(projectUrl, shareText)}>
          <img src={linkedin} alt="linkedin" />
          <div className="title">Share with LinkedIn</div>
        </a>
      </div>
      <div className="social-media-share twitter">
        <a href={twitterLink(projectUrl, shareText)}>
          <img src={twitter} alt="twitter" />
          <div className="title">Share with Twitter</div>
        </a>
      </div>
      {/*TODO telegram icon*/}
      <div className="social-media-share telegram">
        <a href={telegramLink(projectUrl, shareText)}>
          <img src={instagram} alt="telegram" />
          <div className="title">Share with Telegram</div>
        </a>
      </div>
    </div>
  );
};

export default ShareView;

const twitterLink = (url, title) => {
  return (
    "https://twitter.com/share" +
    objectToGetParams({
      url,
      text: title,
    })
  );
};

const facebookLink = (url, title) => {
  return (
    "https://www.facebook.com/sharer/sharer.php" +
    objectToGetParams({
      u: url,
      quote: title,
    })
  );
};

const linkedInLink = (url, title) => {
  return (
    "https://linkedin.com/shareArticle" +
    objectToGetParams({
      url,
      mini: "true",
      title,
    })
  );
};

const telegramLink = (url, title) => {
  return (
    "https://telegram.me/share/url" +
    objectToGetParams({
      url,
      text: title,
    })
  );
};

function objectToGetParams(object) {
  const params = Object.entries(object).map(
    ([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
  );

  return params.length > 0 ? `?${params.join("&")}` : "";
}
