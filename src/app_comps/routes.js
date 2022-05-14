import { Route, Routes } from "react-router-dom";
import { CreateDao } from "../create/CreateDao";
import { FundsActivity } from "../funds_activity/FundsActivity";
import { Investment } from "../investment/Investment";
import { MyDaos } from "../my_daos/MyDaos";
import { Dao } from "../dao/Dao";
import { Stats } from "../stats/Stats";
import { Withdrawal } from "../withdraw/Withdraw";
import { NotFound } from "./NotFound";
import { OuterWireframe } from "./OuterWireframe.js";
import { Wireframe } from "./Wireframe";
import { Settings } from "../settings/Settings";

export const routesView = (deps) => {
  return (
    <Routes>
      <Route path="/" element={<OuterWireframe />}>
        <Route path="/" element={<Wireframe isGlobal={true} deps={deps} />}>
          <Route path="/" element={<CreateDao deps={deps} />} />
          <Route path="my_projects" element={<MyDaos deps={deps} />} />
        </Route>
        <Route path=":id" element={<Wireframe isGlobal={false} deps={deps} />}>
          <Route index element={<Dao deps={deps} />} />
          <Route exact path="investment" element={<Investment deps={deps} />} />
          <Route exact path="withdraw" element={<Withdrawal deps={deps} />} />
          <Route
            exact
            path="funds_activity"
            element={<FundsActivity deps={deps} />}
          />
          <Route exact path="stats" element={<Stats deps={deps} />} />
          <Route exact path="settings" element={<Settings deps={deps} />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
};
