import React, { useState, useEffect } from "react";
import { signTxs } from "./MyAlgo";

const wasmPromise = import("wasm");

export const Withdrawal = (props) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          init_log,
          bridge_load_withdrawal_requests,
          bridge_load_project_user_view,
        } = await wasmPromise;
        await init_log();

        console.log(
          "props.history.location.state: " + props.history.location.state
        );
        // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
        var project = null;
        if (props.history.location.state) {
          project = props.history.location.state;
        } else {
          project = await bridge_load_project_user_view(props.match.params.id);
        }

        const withdrawalRequestsRes = await bridge_load_withdrawal_requests({
          project_id: project.id,
        });
        console.log(
          "withdrawalRequestsRes: " + JSON.stringify(withdrawalRequestsRes)
        );

        setProject(project);
        setWithdrawalRequests(withdrawalRequestsRes.requests);
      } catch (e) {
        props.statusMsg.error(e);
      }
    };
    init();
  }, [props.history.location.state, props.match.params, props.statusMsg]);

  const withdrawButtonEl = (req) => {
    if (req.can_withdraw) {
      return (
        <div>
          <button
            disabled={req.votes < project.vote_threshold}
            onClick={async () => {
              try {
                const {
                  bridge_withdraw,
                  bridge_submit_withdrawal_request,
                  bridge_load_withdrawal_requests,
                } = await wasmPromise;

                props.showProgress(true);
                let withdrawRes = await bridge_withdraw({
                  project_id: project.id,
                  sender: props.myAddress,
                  withdrawal_amount: req.amount_not_formatted,
                  slot_id: req.slot_id,
                });
                console.log("withdrawRes: " + JSON.stringify(withdrawRes));
                props.showProgress(false);

                let withdrawSigned = await signTxs(withdrawRes.to_sign);

                console.log("withdrawSigned: " + withdrawSigned);

                props.showProgress(true);
                let submitWithdrawalRes =
                  await bridge_submit_withdrawal_request({
                    request_id: req.request_id,
                    txs: withdrawSigned,
                    pt: withdrawRes.pt,
                  });

                console.log(
                  "submitWithdrawalRes: " + JSON.stringify(submitWithdrawalRes)
                );

                // reload withdrawal requests: to refresh completed status (UI)
                // TODO maybe frontend-only operation, especially when using indexer later to
                // determine this it will be slow most likely
                const withdrawalRequestsRes =
                  await bridge_load_withdrawal_requests({
                    project_id: project.id,
                  });
                console.log(
                  "withdrawalRequestsRes: " +
                    JSON.stringify(withdrawalRequestsRes)
                );

                props.statusMsg.success("Withdrawal success");

                setWithdrawalRequests(withdrawalRequestsRes.requests);
                props.showProgress(false);
              } catch (e) {
                props.statusMsg.error(e);
                props.showProgress(false);
              }
            }}
          >
            {"Withdraw"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  const projectViewElement = () => {
    if (project) {
      return (
        <div>
          <p>{"Project name:"}</p>
          <a href={project.project_link} target="_blank" rel="noreferrer">
            {project.name}
          </a>
          <p>{"How much (Algo)?"}</p>
          <input
            placeholder=""
            className="address-input"
            size="64"
            value={withdrawalAmount}
            onChange={(event) => {
              setWithdrawalAmount(event.target.value);
            }}
          />
          <p>{"For what?"}</p>
          <input
            placeholder=""
            className="address-input"
            size="64"
            value={withdrawalDescr}
            onChange={(event) => {
              setWithdrawalDescr(event.target.value);
            }}
          />
          <button
            disabled={props.myAddress === ""}
            onClick={async () => {
              try {
                const {
                  bridge_init_withdrawal_request,
                  bridge_submit_init_withdrawal_request,
                } = await wasmPromise;

                props.showProgress(true);
                let initWithdrawalRequestRes =
                  await bridge_init_withdrawal_request({
                    project_id: project.id,
                    sender: props.myAddress,
                    withdrawal_amount: withdrawalAmount,
                  });
                // TODO update list with returned withdrawals list
                console.log(
                  "initWithdrawalRequestRes: " +
                    JSON.stringify(initWithdrawalRequestRes)
                );
                props.showProgress(false);

                let initWithdrawalRequestSigned = await signTxs(
                  initWithdrawalRequestRes.to_sign
                );
                console.log(
                  "initWithdrawalRequestSigned: " + initWithdrawalRequestSigned
                );

                props.showProgress(true);
                let submitInitWithdrawalRequestRes =
                  await bridge_submit_init_withdrawal_request({
                    txs: initWithdrawalRequestSigned,
                    pt: initWithdrawalRequestRes.pt,
                    description: withdrawalDescr,
                  });

                console.log(
                  "submitInitWithdrawalRequestRes: " +
                    JSON.stringify(submitInitWithdrawalRequestRes)
                );

                // we just prepend the added request in js
                // can consider doing this in the server later to make sure list/page is up to date,
                // prob not worth it though, as there's only one person making requests at a time
                setWithdrawalRequests(
                  [submitInitWithdrawalRequestRes.saved_request].concat(
                    withdrawalRequests
                  )
                );

                props.statusMsg.success("Withdrawal request submitted");
                props.showProgress(false);
              } catch (e) {
                props.statusMsg.error(e);
                props.showProgress(false);
              }
            }}
          >
            {"Submit"}
          </button>
          <div className="withdrawal-cell-container">
            {withdrawalRequests &&
              withdrawalRequests.map((req) => (
                // TODO db id maybe? - or ensure backend uses this as unique
                <div
                  key={req.date + req.description}
                  className="withdrawal-cell"
                >
                  {/* maybe format the date in JS? not sure we want to internationalize wasm */}
                  <p>{"Date: " + req.date}</p>
                  <p>{"Amount: " + req.amount}</p>
                  <p>{"Description: " + req.description}</p>
                  <p>{"Votes: " + req.votes}</p>
                  <p>{"Complete: " + req.complete}</p>
                  {withdrawButtonEl(req)}
                </div>
              ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="container">{projectViewElement()}</div>
    </div>
  );
};
