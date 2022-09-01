const wasmPromise = import("wasm");

export const setDevSettings = async (
  deps,
  daoId,
  showProgress,
  unixTimestampInSeconds
) => {
  try {
    const { bridge_set_dev_settings, bridge_submit_set_dev_settings } =
      await wasmPromise;
    const setDevRes = await bridge_set_dev_settings({
      dao_id: daoId,
      sender_address: deps.myAddress,
      min_raise_target_end_date: unixTimestampInSeconds,
    });

    console.log("toSign: " + JSON.stringify(setDevRes));

    let setDevSettingsSigned = await deps.wallet.signTxs(setDevRes.to_sign);
    console.log(
      "setDevSettingsSigned: " + JSON.stringify(setDevSettingsSigned)
    );

    showProgress(true);
    await bridge_submit_set_dev_settings({
      txs: setDevSettingsSigned,
    });
    console.log("✅ Dev setting set.");
    showProgress(false);
  } catch (e) {
    deps.statusMsg.error(e);
  }
};
