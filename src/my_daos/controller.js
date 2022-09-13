const wasmPromise = import("wasm");

export const loadMyDaos = async (statusMsg, myAddress, setMyDaos) => {
  try {
    const { bridge_my_daos } = await wasmPromise;

    const myDaosRes = await bridge_my_daos({
      address: myAddress,
    });
    console.log("myDaosRes: " + JSON.stringify(myDaosRes));

    setMyDaos(myDaosRes.daos);
  } catch (e) {
    statusMsg.error(e);
  }
};
