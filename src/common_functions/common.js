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

export const pieChartColors = () => {
  return [
    "#4CA5A9",
    "#8ECACD",
    "#8ECACD",
    "#BCDBDF",
    "#C8E3E3",
    "#D9E9EB",
    "#E4F0F1",
    "#F1F8F8",
  ];
};
