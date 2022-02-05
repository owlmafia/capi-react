const wasmPromise = import("wasm");

export const updateMyShares = async (
  statusMsg,
  projectId,
  myAddress,
  setMyShares
) => {
  try {
    const { init_log, bridge_my_shares } = await wasmPromise;
    await init_log();
    let mySharesRes = await bridge_my_shares({
      project_id: projectId,
      my_address: myAddress,
    });
    console.log("mySharesRes: %o", mySharesRes);
    setMyShares(mySharesRes);
  } catch (e) {
    statusMsg.error(e);
  }
};
