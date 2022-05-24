const wasmPromise = import("wasm");

export const initLog = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateMyShares = async (
  statusMsg,
  daoId,
  myAddress,
  setMyShares
) => {
  try {
    const { bridge_my_shares } = await wasmPromise;
    let mySharesRes = await bridge_my_shares({
      dao_id: daoId,
      my_address: myAddress,
    });
    console.log("mySharesRes: %o", mySharesRes);
    setMyShares(mySharesRes);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateMyBalance_ = async (
  statusMsg,
  myAddress,
  updateMyBalance
) => {
  try {
    const { bridge_balance } = await wasmPromise;
    const balance = await bridge_balance({ address: myAddress });
    console.log("Balance update res: %o", balance);
    await updateMyBalance(balance);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateMyDividend_ = async (
  statusMsg,
  daoId,
  myAddress,
  setMyDividend
) => {
  try {
    const { bridge_my_dividend } = await wasmPromise;
    let myDividendRes = await bridge_my_dividend({
      dao_id: daoId,
      investor_address: myAddress,
    });
    console.log("myDividendRes: %o", myDividendRes);
    setMyDividend(myDividendRes);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateDao_ = async (daoId, setDao, statusMsg) => {
  try {
    const { bridge_load_dao } = await wasmPromise;
    let dao = await bridge_load_dao(daoId);
    setDao(dao);
    // // these are overwritten when draining, so we keep them separate
    // // TODO drain here? is this comment up to date?
    // setFunds(viewDao.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};
