import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initWithDaoId } from "./controller";
import { Wireframe } from "./Wireframe";
import { WireframeMobile } from "./WireframeMobile";

export const WireframeWrapper = ({ isGlobal, isMobile, deps }) => {
  let params = useParams();
  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await initWithDaoId(params.id, setDao, deps.statusMsg);
      }
    }
    asyncInit();
  }, [params.id, deps.statusMsg]);

  return isMobile ? (
    <WireframeMobile isGlobal={isGlobal} deps={deps} dao={dao} />
  ) : (
    <Wireframe isGlobal={isGlobal} deps={deps} dao={dao} />
  );
};
