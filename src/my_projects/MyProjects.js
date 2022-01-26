import React, { useState, useEffect } from "react";
import { init, loadMyProjects } from "./controller";
import { MyProjectItem } from "./MyProjectItem";
import { ContentTitle } from "../ContentTitle";

export const MyProjects = (props) => {
  const [myProjects, setMyProjects] = useState([]);

  useEffect(() => {
    init(props.statusMsg);
  }, [props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadMyProjects(props.statusMsg, props.myAddress, setMyProjects);
    }
  }, [props.statusMsg, props.myAddress]);

  const myProjectsView = () => {
    return (
      myProjects && (
        <div>
          {myProjects.map((project) => (
            <MyProjectItem project={project} />
          ))}
        </div>
      )
    );
  };

  const view = () => {
    return (
      <div>
        <ContentTitle title="My projects" />
        {myProjectsView()}
      </div>
    );
  };

  return (
    <div>
      <div className="container">{view()}</div>
    </div>
  );
};
