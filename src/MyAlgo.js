import MyAlgo from "@randlabs/myalgo-connect";

const myAlgoWallet = new MyAlgo();

export const connectWallet = async () => {
  const accounts = await myAlgoWallet.connect();
  const addresses = accounts.map((account) => account.address);

  if (addresses.length === 0) {
    throw new Error("Please select an address.");
  } else if (addresses.length > 1) {
    throw new Error("Please select only one address.");
  } else {
    return addresses[0];
  }
};

// Sign multiple txs (returns signed txs array)
export const signTxs = async (tx) => {
  let signedTxs = await myAlgoWallet.signTransaction(tx);
  return signedTxs.map((t) => toTxForRust(t));
};

const toTxForRust = (myAlgoSignedTx) => {
  return {
    txId: myAlgoSignedTx.txID,
    // Uint8Array -> array (otherwise parsing to Vec<u8> in Rust doesn't work)
    blob: Array.from(myAlgoSignedTx.blob),
  };
};
