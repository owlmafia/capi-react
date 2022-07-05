import { useNavigate } from "react-router-dom";
import { SubmitButton } from "./SubmitButton";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="container">
        <div className="http-error-label">{"404"}</div>
        <div className="http-error-message">
          {"The requested URL was not found on this server."}
        </div>
        <div className="http-error-descr">
          {"Oops, sorry we can't find that page!"}
        </div>
        <div className="http-error-descr">
          {"Either something went wrong or the page doesn't exist anymore"}
        </div>
        <div className="http-error-descr">{"Let's start from beginning"}</div>
        <SubmitButton
          label={"To homepage"}
          className="http-submit-button"
          onClick={async () => {
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};
