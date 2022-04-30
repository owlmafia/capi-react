import React, { useState, useEffect } from "react";
import { init, loadMyDaos } from "./controller";
import { MyDaoItem } from "./MyDaoItem";
import { ContentTitle } from "../ContentTitle";

export const MyDaos = (props) => {
  const [myDaos, setMyDaos] = useState([]);

  useEffect(() => {
    init(props.statusMsg);
  }, [props.statusMsg]);

  useEffect(() => {
    if (props.myAddress) {
      loadMyDaos(props.statusMsg, props.myAddress, setMyDaos);
    }
  }, [props.statusMsg, props.myAddress]);

  const myDaosView = () => {
    return (
      myDaos && (
        <div className="my-daos-container">
          {myDaos.map((dao) => (
            <MyDaoItem dao={dao} />
          ))}
        </div>
      )
    );
  };

  const view = () => {
    return (
      <div>
        <ContentTitle title="My projects" />
        {myDaosView()}
      </div>
    );
  };

  return <div>{view()}</div>;
};
