export const toFriendlyError = (msg) => {
  console.log("to fiendlyerror: %o", msg);
  return (
    txIdNotFoundError(msg) ??
    tryOverspendError(msg) ??
    tryAssetNotOptedInError(msg) ??
    tryAssetOverspendError(msg)
  );
};

export const tryOverspendError = (msg) => {
  const regex = /account\s(.*?),/;
  const match = msg.match(regex);
  console.log("in tryOverspendError");

  if (match && match.length === 2) {
    let address = match[1];
    return (
      "Address " + address + " doesn't have enough funds to complete the swap."
    );
  } else {
    return null;
  }
};

export const tryAssetNotOptedInError = (msg) => {
  // TransactionPool.Remember: transaction X: asset Y missing from Z
  const regex = /asset\s(.*)\smissing from\s(.*)$/;
  const match = msg.match(regex);
  console.log("match: %o", match);
  if (match && match.length === 3) {
    let asset = match[1];
    let address = match[2];
    return (
      "Can't swap: Address " + address + " is not opted in to asset " + asset
    );
  } else {
    return null;
  }
};

export const tryAssetOverspendError = (msg) => {
  // TransactionPool.Remember: transaction X: underflow on subtracting 1000000 from sender amount 1000
  const regex = /underflow on subtracting (.*) from sender amount (.*)$/;
  const match = msg.match(regex);
  console.log("match: %o", match);
  if (match && match.length === 3) {
    let attemptedAmount = match[1];
    let balance = match[2];
    return (
      "Can't swap: Insuffient asset balance (holdings: " +
      balance +
      ", attempted: " +
      attemptedAmount +
      ")."
    );
  } else {
    return null;
  }
};

export const txIdNotFoundError = (msg) => {
  // http error: Some("http://127.0.0.1:8980/v2/transactions/X"), Http error: 404, no transaction found for transaction id: X
  const regex = /, no transaction found for transaction id: (.*)$/;
  const match = msg.match(regex);
  console.log("match: %o", match);
  if (match && match.length === 2) {
    let txId = match[1];
    return "Tx id not found: " + txId;
  } else {
    return null;
  }
};
