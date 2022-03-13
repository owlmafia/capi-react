const wasmPromise = import("wasm");

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
