const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadMyDaos = async (statusMsg, address, setMyDaos) => {
  try {
    const { bridge_my_daos } = await wasmPromise;

    const myDaosRes = await bridge_my_daos({
      address: address,
    });
    console.log("myDaosRes: " + JSON.stringify(myDaosRes));

    setMyDaos(myDaosRes.daos);
  } catch (e) {
    statusMsg.error(e);
  }
};
