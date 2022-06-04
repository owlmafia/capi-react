const wasmPromise = import("wasm");

export const startBuyCurrencyFlow = async (statusMsg, closeModal) => {
  try {
    const { bridge_reserve_wyre } = await wasmPromise;
    const reserveWyreRes = await bridge_reserve_wyre();

    // TODO return only reservation in rust - we don't use url
    openWyreCheckoutDialog(statusMsg, reserveWyreRes.reservation, closeModal);
  } catch (e) {
    statusMsg.error(e);
  }
};

// see https://docs.sendwyre.com/docs/checkout-hosted-dialog
const openWyreCheckoutDialog = (statusMsg, reservation, closeModal) => {
  const Wyre = window.Wyre;

  // debit card popup
  // note: currently lists credit / debit and Apple Pay on Safari
  var widget = new Wyre({
    env: "test",
    reservation: reservation,
    // A reservation id is mandatory. In order for the widget to open properly you must use a new, unexpired reservation id.
    // Reservation ids are only valid for 1 hour. A new reservation must also be made if a transaction fails.
    operation: {
      type: "debitcard-hosted-dialog",
    },
  });

  widget.on("paymentSuccess", function (e) {
    console.log("paymentSuccess", e);
  });

  widget.open();
  closeModal();
};
