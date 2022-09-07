import {
  bridge_load_dao,
  bridge_submit_withdraw,
  bridge_withdraw,
} from "../pkg";

export const init = async (statusMsg, daoId, daoMaybe, setDao) => {
  try {
    // if we're loading via URL (instead of another page that passes the dao as parameter), fetch the dao
    var dao = null;
    if (daoMaybe) {
      dao = daoMaybe;
    } else {
      dao = await bridge_load_dao(daoId);
    }

    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const withdraw = async (
  statusMsg,
  myAddress,
  wallet,
  updateMyBalance,
  updateFunds,

  showProgress,
  daoId,
  withdrawalAmount,
  withdrawalDescr
) => {
  try {
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

    let withdrawResSigned = await wallet.signTxs(withdrawRes.to_sign);
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
