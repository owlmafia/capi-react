export const ProjectName = (props) => {
  return (
    <div id="content__title">
      <a href={props.project.project_link} target="_blank" rel="noreferrer">
        {props.project.name}
      </a>
    </div>
  );
};

export const ContentTitle = ({ title }) => {
  return <div id="content__title">{title}</div>;
};
