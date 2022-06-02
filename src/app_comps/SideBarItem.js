import { NavLink } from "react-router-dom";

const SideBarItem = ({ imageSrc, route, label, showBadge }) => {
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
      {showBadge && <div>{""}</div>}
    </div>
  );
};

export default SideBarItem;
