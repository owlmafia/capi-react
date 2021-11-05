const wasmPromise = import("wasm");

export const init = async (
  projectId,
  setViewProject,
  setFunds,
  setCustomerAddressDisplay,
  statusMsg,
  setOpenWithdrawalRequestsCount
) => {
  try {
    const { init_log, bridge_view_project } = await wasmPromise;
    await init_log();
    let viewProject = await bridge_view_project({
      project_id: projectId,
    });
    setViewProject(viewProject);
    // these are overwritten when draining, so we keep them separate
    setFunds(viewProject.available_funds);

    const customerAddress = viewProject.project.customer_escrow_address;
    const shortAddress = shortedAddress(customerAddress);
    setCustomerAddressDisplay(shortAddress);
    retrieveOpenWithdrawalRequests(projectId, statusMsg, setOpenWithdrawalRequestsCount);
  } catch (e) {
    statusMsg.error(e);
  }
};

const shortedAddress = (address) => {
  const short_chars = 3;
  const leading = address.substring(0, short_chars);
  const trailing = address.substring(address.length - short_chars);
  return leading + "..." + trailing;
};


export const retrieveOpenWithdrawalRequests = async (
  projectId,
  statusMsg,
  setOpenWithdrawalRequestsCount
) => {
  try {
    const { bridge_load_open_withdrawal_requests } = await wasmPromise;
    let res = await bridge_load_open_withdrawal_requests({
      project_id: projectId
    });
    console.log("open withdrawal requests res: " + JSON.stringify(res));
    setOpenWithdrawalRequestsCount(res.open_request_count);
  } catch (e) {
    statusMsg.error(e);
  }
};