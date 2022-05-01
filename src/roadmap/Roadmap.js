import React, { useState, useEffect } from "react";
import { init, loadRoadmap } from "./controller";
import { RoadMapItem } from "./RoadmapItem";
import { useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { HiPlus as AddIcon } from "react-icons/hi";
import Modal from "../Modal";
import { AddRoadmapItem } from "./AddRoadmapItem";

export const Roadmap = (props) => {
  let params = useParams();

  const [roadmapItems, setRoadmapItems] = useState([]);
  const [dao, setDao] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    init(params.id, setDao, props.statusMsg);
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadRoadmap(props.statusMsg, params.id, props.myAddress, setRoadmapItems);
    }
  }, [params.id, props.statusMsg, props.myAddress]);

  const view = () => {
    return (
      dao && (
        <div className="roadmap-container">
          <ContentTitle title={"Roadmap"}>
            <button className="title_right_button" onClick={() => setModal((visible) => !visible)}>
              <AddIcon className="title_right_icon"/>
              Add milestone
            </button>
          </ContentTitle>
          {roadmapItems && roadmapItems.length > 0 && itemsList(roadmapItems)}
        </div>
      )
    );
  };

  return (
    <div>
      <div>{view()}</div>
      {modal && (
        <Modal title={"Add roadmap item"} onCloseClick={() => setModal(null)}>
          <AddRoadmapItem
            statusMsg={props.statusMsg}
            showProgress={props.showProgress}
            updateMyBalance={props.updateMyBalance}
            daoId={params.id}
            myAddress={props.myAddress}
          />
        </Modal>
      )}
    </div>
  );
};

const itemsList = (items) => {
  return (
    <div className="withdrawal-cell-container">
      {items.map((item) => toElement(item))}
    </div>
  );
};

const toElement = (item) => {
  if (item.item_type === "item") {
    return toItemElement(item);
  } else if (item.item_type === "header") {
    return toHeaderElement(item);
  } else {
    throw Error("Invalid item type in roadmap: " + JSON.stringify(item));
  }
};

const toItemElement = (item) => {
  return <RoadMapItem item={item} key={item.tx_id} />;
};

const toHeaderElement = (header) => {
  return (
    <div key={header.text} className="roadmap_header">
      <svg className="roadmap_header__line_svg">
        <circle cx="50%" cy="50%" r="4" />
        <line x1="50%" y1="0" x2="50%" y2="100%" />
      </svg>
      <p>{header.text}</p>
    </div>
  );
};
