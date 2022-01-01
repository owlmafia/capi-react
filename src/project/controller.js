const wasmPromise = import("wasm");

export const init = async (
  projectId,
  setViewProject,
  setFunds,
  setCustomerAddressDisplay,
  statusMsg
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
  } catch (e) {
    statusMsg.error(e);
  }
};

export const fetchHolderCount = async (statusMsg, assetId, setHolderCount) => {
  try {
    const { init_log, bridge_holders_count } = await wasmPromise;
    await init_log();
    let res = await bridge_holders_count({
      asset_id: assetId,
    });
    console.log("holders count res: " + JSON.stringify(res));
    setHolderCount(res.count);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const fetchSharesDistribution = async (
  statusMsg,
  assetId,
  assetSupply
) => {
  try {
    const { bridge_shares_distribution } = await wasmPromise;
    let res = await bridge_shares_distribution({
      asset_id: assetId,
      asset_supply: assetSupply,
    });
    console.log("Shares distribution res: " + JSON.stringify(res));
    return res.holders;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};

export const fetchIncomeVsSpendingChartData = async (
  statusMsg,
  projectUuid
) => {
  try {
    const { bridge_income_vs_spending } = await wasmPromise;
    let res = await bridge_income_vs_spending({
      project_uuid: projectUuid,
    });
    console.log("Income and spending chart: %o", res);
    return res;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};

const shortedAddress = (address) => {
  const short_chars = 3;
  const leading = address.substring(0, short_chars);
  const trailing = address.substring(address.length - short_chars);
  return leading + "..." + trailing;
};
