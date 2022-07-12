import { Link } from "react-router-dom";

export const MyDaoItem = ({ dao }) => {
  return (
    // the dao url is unique
    <div key={dao.url_rel} className="my_dao">
      <Link to={dao.url_rel}>{dao.name}</Link>
      <div className="img-placeholder">
        <img src={dao.image_url}></img>
      </div>
      {/* for now not don't involvement role - there's no design and not sure it's really needed */}
      {/* {involvementIcons(dao)} */}
    </div>
  );
};

// const involvementIcons = (dao) => {
//   let icons = [];
//   if (dao.created_by_me === "true") {
//     icons.push(involvementIcon("todo", ""));
//   }
//   if (dao.invested_by_me === "true") {
//     icons.push(involvementIcon("todo", ""));
//   }
//   return icons;
// };

const involvementIcon = (src, alt) => {
  return (
    <img
      className="my_dao__involvement_icon img-placeholder"
      src={src}
      alt={alt}
    />
  );
};
