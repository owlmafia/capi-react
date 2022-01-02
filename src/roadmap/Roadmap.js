import React, { useState, useEffect } from "react";
import { init, loadRoadmap } from "./controller";
import { ProjectName } from "../ProjectName";
import { RoadMapItem } from "./RoadmapItem";

export const Roadmap = (props) => {
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    init(props.match.params.uuid, setProject, props.statusMsg);
  }, [props.match.params.uuid, props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadRoadmap(
        props.statusMsg,
        props.match.params.uuid,
        props.myAddress,
        setRoadmapItems
      );
    }
  }, [props.match.params.uuid, props.statusMsg, props.myAddress]);

  const roadmapItemsView = () => {
    return (
      roadmapItems &&
      roadmapItems.length > 0 && (
        <div className="withdrawal-cell-container">
          <div className="subtitle">{"Roadmap"}</div>
          {roadmapItems &&
            roadmapItems.map((item) => (
              <RoadMapItem
                item={item}
                onEdit={(item) => console.log("TODO edit item: %o", item)}
              />
            ))}
        </div>
      )
    );
  };

  const view = () => {
    return (
      project && (
        <div>
          <ProjectName project={project} />
          {roadmapItemsView()}
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
