import React, { useState, useEffect } from "react";
import { init, addRoadmapItem } from "./controller";
import { ProjectName } from "../ProjectName";

export const AddRoadmapItem = (props) => {
  const [itemTitle, setItemTitle] = useState("item title blabbla");
  const [project, setProject] = useState(null);

  useEffect(() => {
    init(props.match.params.uuid, setProject, props.statusMsg);
  }, [props.match.params.uuid, props.statusMsg]);

  const view = () => {
    return (
      project && (
        <div>
          <ProjectName project={project} />
          <div>{"Title"}</div>
          <input
            placeholder=""
            className="full-width-input"
            size="64"
            value={itemTitle}
            onChange={(event) => {
              setItemTitle(event.target.value);
            }}
          />
          <button
            disabled={props.myAddress === ""}
            onClick={async () => {
              await addRoadmapItem(
                props.statusMsg,
                props.showProgress,
                props.setMyBalance,
                props.match.params.uuid,
                props.myAddress,
                itemTitle
              );
            }}
          >
            {"Add"}
          </button>
        </div>
      )
    );
  };

  return (
    <div>
      <div className="container">{view()}</div>
    </div>
  );
};
