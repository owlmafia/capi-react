import { signTx } from "../MyAlgo";

const wasmPromise = import("wasm");

export const init = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    await init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const pay = async (
  myAddress,
  showProgress,
  statusMsg,
  setMyBalance,
  project,
  amount
) => {
  try {
    const { bridge_pay_project, bridge_submit_pay_project, bridge_balance } =
      await wasmPromise;
    statusMsg.clear();

    // console.log("??? %o", project);
    showProgress(true);

    let payRes = await bridge_pay_project({
      customer_address: myAddress,
      customer_escrow_address: project.customer_escrow_address,
      amount: amount,
    });
    console.log("payRes: " + JSON.stringify(payRes));
    showProgress(false);

    let paySigned = await signTx(payRes.to_sign);
    console.log("paySigned: " + JSON.stringify(paySigned));

    showProgress(true);
    let submitPayRes = await bridge_submit_pay_project({
      tx: paySigned,
    });
    console.log("submitPayRes: " + JSON.stringify(submitPayRes));
    showProgress(false);

    const balance = await bridge_balance({ address: myAddress });
    setMyBalance(balance.balance);

    statusMsg.success("Payment submitted!");
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};