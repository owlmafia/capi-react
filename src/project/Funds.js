import { BsArrowUpCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FundsAssetImg } from "../images/FundsAssetImg";

export const Funds = ({
  funds,
  showWithdrawLink,
  projectId,
  containerClassNameOpt,
}) => {
  const withdrawButton = () => {
    return (
      showWithdrawLink && (
        <span>
          <Link to={"/" + projectId + "/withdraw"}>
            <BsArrowUpCircle id="withdraw_icon" />
          </Link>
        </span>
      )
    );
  };

  return (
    <div id="project_funds__cont" className={containerClassNameOpt}>
      <div>{"Available funds"}</div>
      <div id="project_funds__val">
        <div>{funds}</div>
        <FundsAssetImg />
        {withdrawButton()}
      </div>
    </div>
  );
};
