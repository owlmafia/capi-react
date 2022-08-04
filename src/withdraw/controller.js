const wasmPromise = import("wasm");

export const init = async (deps, daoId, daoMaybe, setDao) => {
  try {
    const { bridge_load_dao } = await wasmPromise;

    // if we're loading via URL (instead of another page that passes the dao as parameter), fetch the dao
    var dao = null;
    if (daoMaybe) {
      dao = daoMaybe;
    } else {
      dao = await bridge_load_dao(daoId);
    }

    setDao(dao);
  } catch (e) {
    deps.statusMsg.error(e);
  }
};

export const withdraw = async (
  deps,
  showProgress,
  daoId,
  withdrawalAmount,
  withdrawalDescr
) => {
  try {
    const { bridge_withdraw, bridge_submit_withdraw } = await wasmPromise;
    deps.statusMsg.clear();

    showProgress(true);
    let withdrawRes = await bridge_withdraw({
      dao_id: daoId,
      sender: deps.myAddress,
      withdrawal_amount: withdrawalAmount,
      description: withdrawalDescr,
    });
    // TODO update list with returned withdrawals list
    console.log("withdrawRes: " + JSON.stringify(withdrawRes));
    showProgress(false);

    let withdrawResSigned = await deps.wallet.signTxs(withdrawRes.to_sign);
    console.log("withdrawResSigned: " + withdrawResSigned);

    showProgress(true);
    let submitWithdrawRes = await bridge_submit_withdraw({
      txs: withdrawResSigned,
      pt: withdrawRes.pt,
    });

    console.log("submitWithdrawRes: " + JSON.stringify(submitWithdrawRes));

    deps.statusMsg.success("Withdrawal request submitted");
    showProgress(false);

    await deps.updateMyBalance(deps.myAddress);
    await deps.updateFunds(daoId);
  } catch (e) {
    deps.statusMsg.error(e);
    showProgress(false);
  }
};
