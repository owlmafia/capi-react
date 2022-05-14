import { NavLink } from "react-router-dom";

const SideBarItem = ({ imageSrc, route, label }) => {
  return (
    <div className="sidebar-item">
      <img src={imageSrc} alt="" />
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
