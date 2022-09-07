import { bridge_load_dao, bridge_submit_unlock, bridge_unlock } from "../pkg";

export const init = async (
  statusMsg,
  myAddress,
  updateInvestmentData,
  updateMyShares,

  daoId,
  setDao
) => {
  try {
    let dao = await bridge_load_dao(daoId);
    console.log("dao: " + JSON.stringify(dao));
    setDao(dao);

    if (myAddress) {
      // TODO check for daoId? or do we know it's always set?
      await updateInvestmentData();
      await updateMyShares(daoId, myAddress);
    }
  } catch (e) {
    statusMsg.error(e);
  }
};

export const unlock = async (
  statusMsg,
  myAddress,
  wallet,
  updateInvestmentData,
  updateMyBalance,
  updateMyShares,

  showProgress,
  daoId
) => {
  try {
    statusMsg.clear();

    showProgress(true);
    let unlockRes = await bridge_unlock({
      dao_id: daoId,
      investor_address: myAddress,
    });
    console.log("unlockRes: " + JSON.stringify(unlockRes));
    showProgress(false);

    let unlockResSigned = await wallet.signTxs(unlockRes.to_sign);
    console.log("unlockResSigned: " + JSON.stringify(unlockResSigned));

    showProgress(true);
    let submitUnlockRes = await bridge_submit_unlock({
      txs: unlockResSigned,
      pt: unlockRes.pt,
    });
    console.log("submitUnlockRes: " + JSON.stringify(submitUnlockRes));

    statusMsg.success("Shares unlocked");
    await updateInvestmentData(daoId, myAddress);
    showProgress(false);

    await updateMyBalance(myAddress);
    await updateMyShares(daoId, myAddress);
    // await updateMyDividend(daoId, myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
