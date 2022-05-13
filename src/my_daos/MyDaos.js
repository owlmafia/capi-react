import React, { useState, useEffect } from "react";
import { init, loadMyDaos } from "./controller";
import { MyDaoItem } from "./MyDaoItem";
import { ContentTitle } from "../ContentTitle";

export const MyDaos = ({ deps }) => {
  const [myDaos, setMyDaos] = useState([]);

  useEffect(() => {
    init(deps.statusMsg);
  }, [deps.statusMsg]);

  useEffect(() => {
    if (deps.myAddress) {
      loadMyDaos(deps.statusMsg, deps.myAddress, setMyDaos);
    }
  }, [deps.statusMsg, deps.myAddress]);

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
