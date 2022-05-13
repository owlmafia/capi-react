import React, { useEffect } from "react";
import { init } from "./controller";
import { MyAccount } from "../app_comps/MyAccount";

export const RightCol = ({ deps, statusMsgUpdater }) => {
  useEffect(() => {
    async function asyncInit() {
      await init(statusMsgUpdater);
    }
    asyncInit();
  }, [statusMsgUpdater]);

  return (
    <div id="rightcol">
      <MyAccount
        deps={deps}
        // no dao here
        daoId={null}
      />
    </div>
  );
};
