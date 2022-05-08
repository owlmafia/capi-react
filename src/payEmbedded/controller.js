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
  updateMyBalance,
  dao,
  amount,
  updateFunds
) => {
  try {
    const { bridge_pay_dao, bridge_submit_pay_dao } = await wasmPromise;
    statusMsg.clear();

    // console.log("??? %o", dao);
    showProgress(true);

    let payRes = await bridge_pay_dao({
      customer_address: myAddress,
      customer_escrow_address: dao.customer_escrow_address,
      amount: amount,
    });
    console.log("payRes: " + JSON.stringify(payRes));
    showProgress(false);

    let paySigned = await signTx(payRes.to_sign);
    console.log("paySigned: " + JSON.stringify(paySigned));

    showProgress(true);
    let submitPayRes = await bridge_submit_pay_dao({
      tx: paySigned,
    });
    console.log("submitPayRes: " + JSON.stringify(submitPayRes));
    showProgress(false);

    statusMsg.success("Payment submitted!");

    await updateMyBalance(myAddress);
    await updateFunds(daoId);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
