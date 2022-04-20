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

export const loadWithdrawals = async (
  statusMsg,
  daoId,
  ownerAddress,
  setWithdrawalRequests
) => {
  try {
    const { bridge_load_withdrawals } = await wasmPromise;

    const withdrawalsRes = await bridge_load_withdrawals({
      dao_id: daoId,
      owner_address: ownerAddress,
    });
    console.log("withdrawalsRes: " + JSON.stringify(withdrawalsRes));

    setWithdrawalRequests(withdrawalsRes.entries);
  } catch (e) {
    statusMsg.error(e);
  }
};
