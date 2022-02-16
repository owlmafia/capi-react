import React from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { connectWallet } from "../MyAlgo";

const wasmPromise = import("wasm");

export const MyAccount = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,
  // optional: if set, shows "my shares"
  projectId,
  myShares,
}) => {
  return (
    <div>
      {connectButton(
        myAddress,
        setMyAddress,
        setMyAddressDisplay,
        updateMyBalance,
        statusMsgUpdater
      )}
      {myAddressView(myAddress, myAddressDisplay, myShares, myBalance)}
    </div>
  );
};

const myAddressView = (myAddress, myAddressDisplay, myShares, myBalance) => {
  if (myAddress !== "") {
    return (
      <div id="user_data">
        <div className="my_address">
          <a
            href={"https://testnet.algoexplorer.io/address/" + myAddress}
            target="_blank"
            rel="noreferrer"
          >
            {myAddressDisplay}
          </a>
        </div>
        {myShares && (
          <div id="my_account_my_balance__shares">
            {"Your shares: " + myShares.total}
          </div>
        )}
        {/* for now show only funds asset. Algo can be helpful for fees, but it
        clutters the UI a bit.  */}
        <div id="my_account_my_balance__balance">
          <div>{myBalance.balance_funds_asset}</div>
          <FundsAssetImg />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const connectButton = (
  myAddress,
  setMyAddress,
  setMyAddressDisplay,
  updateMyBalance,
  statusMsgUpdater
) => {
  if (myAddress === "") {
    return (
      <button
        className="button__connect"
        onClick={async (event) => {
          try {
            let address = await connectWallet();
            setMyAddress(address);

            const short_chars = 3;
            const leading = address.substring(0, short_chars);
            const trailing = address.substring(address.length - short_chars);
            const shortAddress = leading + "..." + trailing;
            setMyAddressDisplay(shortAddress);

            await updateMyBalance(address);
          } catch (e) {
            statusMsgUpdater.error(e);
          }
        }}
      >
        {"Connect My Algo wallet"}
      </button>
    );
  } else {
    return (
      <button
        className="button__disconnect"
        onClick={() => {
          setMyAddress("");
        }}
      >
        {"Disconnect"}
      </button>
    );
  }
};
