const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;

    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};
