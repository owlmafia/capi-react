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
    await updateFunds();
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const updateDao = async (daoId, setViewDao, setFunds, statusMsg) => {
  try {
    const { bridge_view_dao } = await wasmPromise;
    let viewDao = await bridge_view_dao({
      dao_id: daoId,
    });
    // setViewDao(viewDao);
    // these are overwritten when draining, so we keep them separate
    // TODO drain here? is this comment up to date?
    setFunds(viewDao.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateFunds_ = async (daoId, setViewDao, setFunds, statusMsg) => {
  /// We don't have a function in WASM yet to fetch only the funds so we re-fetch the dao.
  /// TODO: optimize: fetch only the funds (probably pass escrows/dao as inputs), so request is quicker.
  updateDao(daoId, setViewDao, setFunds, statusMsg);
};
