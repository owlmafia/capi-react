import { Route, Routes } from "react-router-dom";
import { CreateDao } from "../create/CreateDao";
import { FundsActivity } from "../funds_activity/FundsActivity";
import { Investment } from "../investment/Investment";
import { MyDaos } from "../my_daos/MyDaos";
import { Dao } from "../dao/Dao";
import { Stats } from "../stats/Stats";
import { Withdrawal } from "../withdraw/Withdraw";
import { NotFound } from "../common_comps/NotFound";
import { OuterWireframe } from "../wireframes/OuterWireframe.js";
import { Settings } from "../settings/Settings";
import { WireframeWrapper } from "../wireframes/WireframeWrapper";
import { Team } from "../team/Team";

export const routesView = (deps) => {
  return (
    <Routes>
      <Route path="/" element={<OuterWireframe />}>
        <Route
          path="/"
          element={<WireframeWrapper deps={deps} isGlobal={true} />}
        >
          <Route path="/" element={<CreateDao deps={deps} />} />
          <Route path="my_projects" element={<MyDaos deps={deps} />} />
        </Route>
        <Route
          path=":id"
          element={<WireframeWrapper deps={deps} isGlobal={false} />}
        >
          <Route index element={<Dao deps={deps} />} />
          {deps.features.team && (
            <Route exact path="team" element={<Team deps={deps} />} />
          )}
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
