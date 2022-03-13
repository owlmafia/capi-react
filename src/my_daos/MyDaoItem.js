import { Link } from "react-router-dom";

export const MyDaoItem = ({ dao }) => {
  return (
    // the dao url is unique
    <div key={dao.url_rel} className="my_dao">
      <Link to={dao.url_rel}>{dao.name}</Link>
      {involvementIcons(dao)}
    </div>
  );
};

const involvementIcons = (dao) => {
  let icons = [];
  if (dao.created_by_me === "true") {
    icons.push(involvementIcon("todo", "Created by me"));
  }
  if (dao.invested_by_me === "true") {
    icons.push(involvementIcon("todo", "Invested"));
  }
  return icons;
};

const involvementIcon = (src, alt) => {
  return <img className="my_dao__involvement_icon" src={src} alt={alt} />;
};
