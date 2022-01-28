import { BsArrowUpCircle } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Funds = ({ funds, amICreator, projectId }) => {
  const withdrawButton = () => {
    return (
      amICreator && (
        <span>
          <Link to={"/" + projectId + "/withdraw"}>
            <BsArrowUpCircle id="withdraw_icon" />
          </Link>
        </span>
      )
    );
  };

  return (
    <div id="project_funds__cont">
      <div>{"Available funds"}</div>
      <div id="project_funds__val">
        <div>{funds}</div>
        {withdrawButton()}
      </div>
    </div>
  );
};
