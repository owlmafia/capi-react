const wasmPromise = import("wasm");

export const loadMyDaos = async (deps, setMyDaos) => {
  try {
    const { bridge_my_daos } = await wasmPromise;

    const myDaosRes = await bridge_my_daos({
      address: deps.myAddress,
    });
    console.log("myDaosRes: " + JSON.stringify(myDaosRes));

    setMyDaos(myDaosRes.daos);
  } catch (e) {
    deps.statusMsg.error(e);
  }
};
