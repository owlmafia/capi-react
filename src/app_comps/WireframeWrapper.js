import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { initWithDaoId } from "./controller";
import { Wireframe } from "./Wireframe";
import { WireframeMobile } from "./WireframeMobile";

export const WireframeWrapper = ({ isGlobal, deps }) => {
  let params = useParams();
  const [dao, setDao] = useState(null);

  let location = useLocation();

  const statusMsgClass = useMemo(() => {
    if (deps.statusMsgDisplay) {
      return "msg-open";
    } else {
      return "msg-close";
    }
  }, [deps.statusMsgDisplay]);

  useEffect(() => {
    async function asyncInit() {
      if (params.id) {
        await initWithDaoId(params.id, setDao, deps.statusMsg);
        deps.updateDaoVersion.call(null, params.id);
      }
    }
    asyncInit();
  }, [params.id, deps.statusMsg, deps.updateDaoVersion]);

  useEffect(() => {
    deps.statusMsg.clear();
  }, [location]);

  return deps.size.s4 ? (
    <WireframeMobile
      isGlobal={isGlobal}
      deps={deps}
      dao={dao}
      statusMsgClass={statusMsgClass}
    />
  ) : (
    <Wireframe
      isGlobal={isGlobal}
      deps={deps}
      dao={dao}
      statusMsgClass={statusMsgClass}
    />
  );
};
