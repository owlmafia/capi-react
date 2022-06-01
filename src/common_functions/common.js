const wasmPromise = import("wasm");

export const toBytesForRust = async (imageBytesPromise) => {
  const ib = await imageBytesPromise;
  const typedArray = new Uint8Array(ib);
  return [...typedArray];
};

export const checkForUpdates = async (statusMsg, daoId, setVersionData) => {
  try {
    const { bridge_check_for_updates } = await wasmPromise;
    let versionData = await bridge_check_for_updates({ dao_id: daoId });

    if (versionData) {
      setVersionData(versionData);
    }
  } catch (e) {
    statusMsg.error(e);
  }
};

export const hasUpdate = (versionData) => {};
