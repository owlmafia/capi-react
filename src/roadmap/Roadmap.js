import React, { useState, useEffect } from "react";
import { init, loadRoadmap } from "./controller";
import { ProjectName } from "../ContentTitle";
import { RoadMapItem } from "./RoadmapItem";
import { useParams } from "react-router-dom";

export const Roadmap = (props) => {
  let params = useParams();

  const [roadmapItems, setRoadmapItems] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    init(params.id, setProject, props.statusMsg);
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadRoadmap(props.statusMsg, params.id, props.myAddress, setRoadmapItems);
    }
  }, [params.id, props.statusMsg, props.myAddress]);

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
          <div>{"yes this is the roadmap"}</div>
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
