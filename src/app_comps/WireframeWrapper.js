import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { checkForUpdates } from "../common_functions/common";
import { initWithDaoId } from "./controller";
import { Wireframe } from "./Wireframe";
import { WireframeMobile } from "./WireframeMobile";

export const WireframeWrapper = ({ isGlobal, deps }) => {
  let params = useParams();
  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await initWithDaoId(params.id, setDao, deps.statusMsg);
        deps.updateDaoVersion.call(null, params.id);
      }
    }
    asyncInit();
  }, [params.id, deps.statusMsg]);

  return deps.isMobile ? (
    <WireframeMobile isGlobal={isGlobal} deps={deps} dao={dao} />
  ) : (
    <Wireframe isGlobal={isGlobal} deps={deps} dao={dao} />
  );
};
