const wasmPromise = import("wasm");

export const loadDescription = async (statusMsg, descrUrl, setDescription) => {
  try {
    const { bridge_description } = await wasmPromise;
    let description = await bridge_description(descrUrl);
    setDescription(description);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadRaisedFunds = async (
  statusMsg,
  daoId,
  setRaisedFunds,
  setRaisedFundsNumber,
  setState
) => {
  try {
    const { bridge_raised_funds } = await wasmPromise;
    let funds = await bridge_raised_funds({ dao_id: daoId });
    setRaisedFunds(funds.raised);
    setRaisedFundsNumber(funds.raised_number);
    setState(stateObj(funds.state, funds.goal_exceeded_percentage));
  } catch (e) {
    statusMsg.error(e);
  }
};

const stateObj = (state, exceeded) => {
  var text;
  var success;

  if (state === "Raising") {
    return null; // no message displayed when funds are still raising
  } else if (state === "GoalReached") {
    text = "The minimum target was reached";
    success = true;
    // "6BB9BD";
  } else if (state === "GoalNotReached") {
    text = "The minimum target was not reached";
    success = false;
    // success = "DE5C62";
  } else if (state === "GoalExceeded") {
    text = "The minumum target was exceeded by " + exceeded;
    success = true;
    // success = "6BB9BD";
  } else {
    throw Error("Invalid funds raise state: " + state);
  }

  return { text: text, success: success };
};
