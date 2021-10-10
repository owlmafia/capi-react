import React, { useState, useEffect } from "react";
import { signTxs } from "./MyAlgo";

const wasmPromise = import("wasm");

export const Withdrawal = (props) => {
  const project = props.history.location.state;

  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const {
          init_log,
          bridge_load_withdrawal_requests,
          bridge_load_project_user_view,
        } = await wasmPromise;
        await init_log();

        // if we're loading via URL (instead of another page that passes the project as parameter), fetch the project
        if (!project) {
          project = await bridge_load_project_user_view(props.match.params.id);
        }

        const withdrawalRequestsRes = await bridge_load_withdrawal_requests({
          project_id: project.id,
        });
        console.log(
          "withdrawalRequestsRes: " + JSON.stringify(withdrawalRequestsRes)
        );
        setWithdrawalRequests(withdrawalRequestsRes.requests);
      } catch (e) {
        props.statusMsg.error(e);
      }
    };
    init();
  }, [project]);

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

                let withdrawRes = await bridge_withdraw({
                  project_id: project.id,
                  sender: props.myAddress,
                  withdrawal_amount: req.amount_not_formatted,
                });
                console.log("withdrawRes: " + JSON.stringify(withdrawRes));

                let withdrawSigned = await signTxs(withdrawRes.to_sign);

                console.log("withdrawSigned: " + withdrawSigned);

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
              } catch (e) {
                props.statusMsg.error(e);
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
          <a href={project.project_link} target="_blank">
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
                const { bridge_send_withdrawal_request } = await wasmPromise;

                let withdrawalRequestRes = await bridge_send_withdrawal_request(
                  {
                    project_id: project.id,
                    sender: props.myAddress,
                    withdrawal_amount: withdrawalAmount,
                    withdrawal_descr: withdrawalDescr,
                  }
                );
                // TODO update list with returned withdrawals list
                console.log(
                  "withdrawalRequestRes: " +
                    JSON.stringify(withdrawalRequestRes)
                );

                // we just prepend the added request in js
                // can consider doing this in the server later to make sure list/page is up to date,
                // prob not worth it though, as there's only one person making requests at a time
                setWithdrawalRequests(
                  [withdrawalRequestRes.saved_request].concat(
                    withdrawalRequests
                  )
                );
                props.statusMsg.success("Withdrawal request submitted");
              } catch (e) {
                props.statusMsg.error(e);
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
