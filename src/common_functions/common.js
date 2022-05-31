export const toBytesForRust = async (imageBytesPromise) => {
  const ib = await imageBytesPromise;
  const typedArray = new Uint8Array(ib);
  return [...typedArray];
};
