import { NavLink } from "react-router-dom";

const SideBarItem = ({ imageSrc, route, label }) => {
  return (
    <div>
      <img src={imageSrc} />
      <NavLink
        end
        to={route}
        className={({ isActive }) =>
          isActive ? "menu_active" : "menu_inactive"
        }
      >
        {label}
      </NavLink>
    </div>
  );
};

export default SideBarItem;
