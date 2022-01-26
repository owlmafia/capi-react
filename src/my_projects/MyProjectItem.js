import { Link } from "react-router-dom";
export const MyProjectItem = ({ project }) => {
  return (
    // the project url is unique
    <div key={project.url_rel} className="my_project">
      <Link to={project.url_rel}>{project.name}</Link>
      {involvementIcons(project)}
    </div>
  );
};

const involvementIcons = (project) => {
  let icons = [];
  if (project.created_by_me === "true") {
    icons.push(involvementIcon("todo"));
  }
  if (project.invested_by_me === "true") {
    icons.push(involvementIcon("todo"));
  }
  return icons;
};

const involvementIcon = (src) => {
  return <img className="my_project__involvement_icon" src={src} />;
};
