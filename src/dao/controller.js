const wasmPromise = import("wasm");

export const loadDescription = async (
  statusMsg,
  descriptionId,
  setDescription
) => {
  try {
    const { bridge_description } = await wasmPromise;
    let description = await bridge_description(descriptionId);
    setDescription(description);
  } catch (e) {
    statusMsg.error(e);
  }
};
