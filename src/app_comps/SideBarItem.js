import { NavLink } from "react-router-dom";

const SideBarItem = ({ imageSrc, route, label }) => {
  return (
    <div className="sidebar-item">
      <NavLink
        end
        to={route}
        className={({ isActive }) =>
          isActive ? "menu_active" : "menu_inactive"
        }
      >
        <img src={imageSrc} alt="" />
        {label}
      </NavLink>
    </div>
  );
};

export default SideBarItem;
