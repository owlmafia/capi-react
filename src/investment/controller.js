const wasmPromise = import("wasm");

export const init = async (deps, daoId, setDao) => {
  try {
    const { bridge_load_dao } = await wasmPromise;

    let dao = await bridge_load_dao(daoId);
    console.log("dao: " + JSON.stringify(dao));
    setDao(dao);

    if (deps.myAddress) {
      // TODO check for daoId? or do we know it's always set?
      await deps.updateInvestmentData();
      await deps.updateMyShares(daoId, deps.myAddress);
    }
  } catch (e) {
    deps.statusMsg.error(e);
  }
};

export const unlock = async (deps, showProgress, daoId) => {
  try {
    const { bridge_unlock, bridge_submit_unlock } = await wasmPromise;
    deps.statusMsg.clear();

    showProgress(true);
    let unlockRes = await bridge_unlock({
      dao_id: daoId,
      investor_address: deps.myAddress,
    });
    console.log("unlockRes: " + JSON.stringify(unlockRes));
    showProgress(false);

    let unlockResSigned = await deps.wallet.signTxs(unlockRes.to_sign);
    console.log("unlockResSigned: " + JSON.stringify(unlockResSigned));

    showProgress(true);
    let submitUnlockRes = await bridge_submit_unlock({
      txs: unlockResSigned,
      pt: unlockRes.pt,
    });
    console.log("submitUnlockRes: " + JSON.stringify(submitUnlockRes));

    deps.statusMsg.success("Shares unlocked");
    await deps.updateInvestmentData(daoId, deps.myAddress);
    showProgress(false);

    await deps.updateMyBalance(deps.myAddress);
    await deps.updateMyShares(daoId, deps.myAddress);
    // await deps.updateMyDividend(daoId, deps.myAddress);
  } catch (e) {
    deps.statusMsg.error(e);
    showProgress(false);
  }
};
