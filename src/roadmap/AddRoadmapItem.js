import React, { useState, useEffect } from "react";
import { init, addRoadmapItem } from "./controller";
import { ProjectName } from "../ContentTitle";
import { useParams } from "react-router-dom";

export const AddRoadmapItem = (props) => {
  let params = useParams();

  const [itemTitle, setItemTitle] = useState("item title blabbla");
  const [project, setProject] = useState(null);

  useEffect(() => {
    init(params.id, setProject, props.statusMsg);
  }, [params.id, props.statusMsg]);

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
                params.id,
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
