import { Link } from "react-router-dom";

export const ProjectName = (props) => {
  return (
    <div id="content__title">
      <Link to={props.project.project_link}>{props.project.name}</Link>
      {props.children}
    </div>
  );
};

export const ContentTitle = ({ title }) => {
  return <div id="content__title">{title}</div>;
};
