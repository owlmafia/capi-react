import { WithdrawalHistory } from "../withdrawal_history/WithdrawalHistory";
import { Roadmap } from "../roadmap/Roadmap";
import { AddRoadmapItem } from "../roadmap/AddRoadmapItem";
import { Stats } from "../stats/Stats";
import { OuterWireframe } from "./OuterWireframe.js";
import { Wireframe } from "./Wireframe";
import { Investment } from "../investment/Investment";
import { Withdrawal } from "../withdraw/Withdraw";
import { NotFound } from "./NotFound";
import { CreateProject } from "../create/CreateProject";
import { Invest } from "../invest/Invest";
import { Project } from "../project/Project";
import { Route, Routes } from "react-router-dom";
import { MyProjects } from "../my_projects/MyProjects";

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
  onCopyErrorMsg,
  errorMsgIsCopied,
  setMyAddressDisplay
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
              onCopyErrorMsg={onCopyErrorMsg}
              errorMsgIsCopied={errorMsgIsCopied}
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
              onCopyErrorMsg={onCopyErrorMsg}
              errorMsgIsCopied={errorMsgIsCopied}
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
            index
            element={
              <Project
                myAddress={myAddress}
                showModal={(modal) => setModal(modal)}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
              />
            }
          />

          <Route
            exact
            path="invest"
            element={
              <Invest
                myAddress={myAddress}
                showModal={(modal) => setModal(modal)}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                setMyBalance={setMyBalance}
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
