import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Wireframe } from "./Wireframe";
import { WireframeMobile } from "./WireframeMobile";

export const WireframeWrapper = ({ isGlobal, deps }) => {
  let params = useParams();

  let location = useLocation();

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        deps.updateDao.call(null, params.id);
        deps.updateDaoVersion.call(null, params.id);
      }
    }
    asyncInit();
  }, [params.id, deps.statusMsg, deps.updateDaoVersion]);

  useEffect(() => {
    deps.statusMsg.clear();
  }, [deps.statusMsg, location]);

  return deps.size.s4 ? (
    <WireframeMobile isGlobal={isGlobal} deps={deps} />
  ) : (
    <Wireframe isGlobal={isGlobal} deps={deps} />
  );
};
