import { Route, Routes } from "react-router-dom";
import { CreateProject } from "../create/CreateProject";
import { FundsActivity } from "../funds_activity/FundsActivity";
import { Investment } from "../investment/Investment";
import { MyProjects } from "../my_projects/MyProjects";
import { Project } from "../project/Project";
import { AddRoadmapItem } from "../roadmap/AddRoadmapItem";
import { Roadmap } from "../roadmap/Roadmap";
import { Stats } from "../stats/Stats";
import { Withdrawal } from "../withdraw/Withdraw";
import { WithdrawalHistory } from "../withdrawal_history/WithdrawalHistory";
import { NotFound } from "./NotFound";
import { OuterWireframe } from "./OuterWireframe.js";
import { Wireframe } from "./Wireframe";

export const routesView = (
  myAddress,
  setMyAddress,
  setModal,
  setShowProgress,
  statusMsgUpdater,
  setMyBalance,
  myAddressDisplay,
  myBalance,
  statusMsg,
  setMyAddressDisplay,
  myShares,
  updateMyShares
) => {
  return (
    <Routes>
      <Route path="/" element={<OuterWireframe />}>
        <Route
          path="global"
          element={
            <Wireframe
              isGlobal={true}
              statusMsg={statusMsg}
              myAddress={myAddress}
              setMyAddress={setMyAddress}
              myAddressDisplay={myAddressDisplay}
              setMyAddressDisplay={setMyAddressDisplay}
              myBalance={myBalance}
              setMyBalance={setMyBalance}
              statusMsgUpdater={statusMsgUpdater}
            />
          }
        >
          <Route
            path="create"
            element={
              <CreateProject
                myAddress={myAddress}
                showModal={(modal) => setModal(modal)}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
          <Route
            path="my_projects"
            element={
              <MyProjects
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
        </Route>
        <Route
          path=":id"
          element={
            <Wireframe
              isGlobal={false}
              statusMsg={statusMsg}
              myAddress={myAddress}
              setMyAddress={setMyAddress}
              myAddressDisplay={myAddressDisplay}
              setMyAddressDisplay={setMyAddressDisplay}
              myBalance={myBalance}
              setMyBalance={setMyBalance}
              statusMsgUpdater={statusMsgUpdater}
              myShares={myShares}
              updateMyShares={updateMyShares}
            />
          }
        >
          <Route
            index
            element={
              <Project
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
                updateMyShares={updateMyShares}
                myShares={myShares}
              />
            }
          />
          <Route
            exact
            path="investment"
            element={
              <Investment
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
                updateMyShares={updateMyShares}
                myShares={myShares}
              />
            }
          />
          <Route
            exact
            path="withdraw"
            element={
              <Withdrawal
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
          <Route
            exact
            path="withdrawal_history"
            element={
              <WithdrawalHistory
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
          <Route
            exact
            path="funds_activity"
            element={
              <FundsActivity
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
          <Route
            exact
            path="roadmap"
            element={
              <Roadmap
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
          <Route
            exact
            path="roadmap/add"
            element={
              <AddRoadmapItem
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />
          <Route
            exact
            path="stats"
            element={
              <Stats
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
              />
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
};
