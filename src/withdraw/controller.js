import { signTxs } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (daoId, daoMaybe, setDao, statusMsg) => {
  try {
    const { init_log, bridge_load_dao_user_view_with_id } = await wasmPromise;
    await init_log();

    // if we're loading via URL (instead of another page that passes the dao as parameter), fetch the dao
    var dao = null;
    if (daoMaybe) {
      dao = daoMaybe;
    } else {
      dao = await bridge_load_dao_user_view_with_id(daoId);
    }

    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const withdraw = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  daoId,
  withdrawalAmount,
  withdrawalDescr,
  updateFunds
) => {
  try {
    const { bridge_withdraw, bridge_submit_withdraw } = await wasmPromise;
    statusMsg.clear();

    showProgress(true);
    let withdrawRes = await bridge_withdraw({
      dao_id: daoId,
      sender: myAddress,
      withdrawal_amount: withdrawalAmount,
      description: withdrawalDescr,
    });
    // TODO update list with returned withdrawals list
    console.log("withdrawRes: " + JSON.stringify(withdrawRes));
    showProgress(false);

    let withdrawResSigned = await signTxs(withdrawRes.to_sign);
    console.log("withdrawResSigned: " + withdrawResSigned);

    showProgress(true);
    let submitWithdrawRes = await bridge_submit_withdraw({
      txs: withdrawResSigned,
      pt: withdrawRes.pt,
    });

    console.log("submitWithdrawRes: " + JSON.stringify(submitWithdrawRes));

    statusMsg.success("Withdrawal request submitted");
    showProgress(false);

    await updateMyBalance(myAddress);
    await updateFunds(daoId);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
