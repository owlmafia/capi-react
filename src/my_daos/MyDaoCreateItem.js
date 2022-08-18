import { Link } from "react-router-dom";
import plus from "../images/svg/plus.svg";

export const MyDaoCreateItem = () => {
  return (
    <div key="create_item_key___" className="my_dao">
      <Link className="text-center" to={"/"}>
        {"Create project"}
      </Link>
      <div className="my_dao_create_project">
        <img src={plus} alt="icon" />
      </div>
    </div>
  );
};
