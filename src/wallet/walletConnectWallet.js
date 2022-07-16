import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import buffer from "buffer";
const { Buffer } = buffer;

export function initWcWalletIfAvailable(
  statusMsg,
  setMyAddress,
  setWallet,
  setWcShowOpenWalletModal
) {
  const wallet = createWcWallet(
    statusMsg,
    setMyAddress,
    setWcShowOpenWalletModal
  );
  if (wallet.isConnected()) {
    wallet.initSession();
    setWallet(wallet);
  }
}

// Note: the wallet connect and my algo wallets share the same "interface"
export function createWcWallet(
  statusMsg,
  setMyAddress,
  setShowOpenWalletModal
) {
  const connector = createConnector();

  const onAddressUpdate = (address) => {
    setMyAddress(address);
  };

  const onDisconnect = () => {
    setMyAddress("");
  };

  // returns address, if needed for immediate use
  async function connect() {
    if (!window.Buffer) window.Buffer = Buffer;
    try {
      if (!connector.connected) {
        await connector.createSession();
      }
      return initSession();
    } catch (e) {
      statusMsg.error(e);
    }
  }

  async function disconnect() {
    if (!window.Buffer) window.Buffer = Buffer;
    try {
      await connector.killSession();
      onDisconnect();
    } catch (e) {
      statusMsg.error(e);
    }
  }

  function onPageLoad() {
    if (!window.Buffer) window.Buffer = Buffer;
    try {
      if (connector.connected) {
        initSession();
      }
    } catch (e) {
      statusMsg.error(e);
    }
  }

  function initSession() {
    if (!window.Buffer) window.Buffer = Buffer;
    try {
      onConnectorConnected(connector, onAddressUpdate, onDisconnect);
    } catch (e) {
      statusMsg.error(e);
    }
  }

  function isConnected() {
    return connector.connected;
  }

  async function signTxs(toSign) {
    if (!window.Buffer) window.Buffer = Buffer;
    // modal tells the user to look at the wallet (usually phone)
    setShowOpenWalletModal(true);
    let blob = await sign(connector, toSign.wc);
    setShowOpenWalletModal(false);
    return {
      blob: blob,
    };
  }

  return {
    id: "WC", // just to identify quickly wallet in logs
    connect,
    disconnect,
    onPageLoad,
    signTxs,

    // these functions are wallet connect specific (and only used in this file)
    // wallet connect preserves the connection between reloads, and they're needed to init the session
    isConnected,
    initSession,
  };
}

const createConnector = () => {
  return new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    qrcodeModal: QRCodeModal,
  });
};

const onConnectorConnected = (connector, onAddressUpdate, onDisconnect) => {
  // if accounts is set in connector, use it, also register to events
  // accounts is set when the page is loaded with an active session,
  // when the wallet is connected it's not set, we get the address from the events
  if (connector.accounts.length === 1) {
    var address = connector.accounts[0];
    console.log("selected address: %o", address);
    onAddressUpdate(address);
  } else if (connector.accounts.length > 1) {
    throw new Error(
      "Unexpected WalletConnect accounts length (connection): " +
        connector.accounts.length
    );
  }

  console.log("connector connected: " + JSON.stringify(connector));
  subscribeToEvents(connector, onAddressUpdate, onDisconnect);
};

const subscribeToEvents = (connector, onAddressUpdate, onDisconnect) => {
  connector.on("connect", (error, payload) => {
    if (error) {
      throw error;
    }
    const { accounts } = payload.params[0];
    if (accounts.length !== 1) {
      throw new Error(
        "Unexpected WalletConnect accounts length (update): " + accounts.length
      );
    }
    console.log("got an address update: " + accounts[0]);
    onAddressUpdate(accounts[0]);
  });

  connector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }

    const { accounts } = payload.params[0];
    console.log("Session update: " + JSON.stringify(accounts));
  });

  connector.on("disconnect", (error, payload) => {
    onDisconnect();
    if (error) {
      throw error;
    }
  });
};

const sign = async (connector, toSign) => {
  const requestParams = [toSign];

  const request = formatJsonRpcRequest("algo_signTxn", requestParams);

  console.log("WalletConnect request: " + JSON.stringify(request));
  const signedTxs = await connector.sendCustomRequest(request);
  console.log("WalletConnect result: " + JSON.stringify(signedTxs));

  const decodedSignedTxs = signedTxs.map((tx) => decode(tx));
  console.log(
    "WalletConnect decodedSignedTxs: " + JSON.stringify(decodedSignedTxs)
  );

  return decodedSignedTxs;
};

const decode = (wcTx) => {
  return Array.from(new Uint8Array(Buffer.from(wcTx, "base64")));
};
