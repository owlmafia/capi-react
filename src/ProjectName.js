export const ProjectName = (props) => {
  return (
    <div className="project-name-container">
      <a
        href={props.project.project_link}
        target="_blank"
        rel="noreferrer"
        className="project-name"
      >
        {props.project.name}
      </a>
    </div>
  );
};
