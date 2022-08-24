import { Link } from "react-router-dom";
import plus from "../images/svg/plus.svg";

export const MyDaoCreateItem = () => {
  return (
    <div key="create_item_key___" className="my_dao">
      <div className="text-center">
        <Link className="text-center" to={"/"}>
          {"Create project"}
        </Link>
      </div>
      <div className="my_dao_create_project">
        <Link className="text-center" to={"/"}>
          <img src={plus} alt="icon" />
        </Link>
      </div>
    </div>
  );
};
