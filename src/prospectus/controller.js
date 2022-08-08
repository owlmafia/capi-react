const wasmPromise = import("wasm");

export const updateHash = async (deps, bytes, setHash) => {
  try {
    const { bridge_calculate_hash } = await wasmPromise;
    let hash = await bridge_calculate_hash({
      bytes,
    });
    setHash(hash);
  } catch (e) {
    deps.statusMsg.error(e);
  }
};
