import { Route, Routes } from "react-router-dom";
import { CreateDao } from "../create/CreateDao";
import { FundsActivity } from "../funds_activity/FundsActivity";
import { Investment } from "../investment/Investment";
import { MyDaos } from "../my_daos/MyDaos";
import { Dao } from "../dao/Dao";
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
  updateMyBalance,
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
              updateMyBalance={updateMyBalance}
              statusMsgUpdater={statusMsgUpdater}
            />
          }
        >
          <Route
            path="create"
            element={
              <CreateDao
                myAddress={myAddress}
                showModal={(modal) => setModal(modal)}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                updateMyBalance={updateMyBalance}
              />
            }
          />
          <Route
            path="my_daos"
            element={
              <MyDaos
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                updateMyBalance={updateMyBalance}
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
              updateMyBalance={updateMyBalance}
              statusMsgUpdater={statusMsgUpdater}
              myShares={myShares}
              updateMyShares={updateMyShares}
            />
          }
        >
          <Route
            index
            element={
              <Dao
                myAddress={myAddress}
                showProgress={(show) => setShowProgress(show)}
                statusMsg={statusMsgUpdater}
                updateMyBalance={updateMyBalance}
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
                updateMyBalance={updateMyBalance}
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
                updateMyBalance={updateMyBalance}
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
                updateMyBalance={updateMyBalance}
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
                updateMyBalance={updateMyBalance}
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
                updateMyBalance={updateMyBalance}
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
                updateMyBalance={updateMyBalance}
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
