import React, { useEffect, useState } from "react";
import { connectWallet } from "../MyAlgo";
import { getMyShares } from "./controller";

const wasmPromise = import("wasm");

export const MyAccount = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  setMyBalance,
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
        setMyBalance,
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
            {"Your shares: " + myShares}
          </div>
        )}
        <div id="my_account_my_balance__balance">{myBalance}</div>
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
  setMyBalance,
  statusMsgUpdater
) => {
  if (myAddress === "") {
    return (
      <button
        className="button__connect"
        onClick={async (event) => {
          try {
            const { bridge_balance } = await wasmPromise;

            let address = await connectWallet();
            setMyAddress(address);

            const short_chars = 3;
            const leading = address.substring(0, short_chars);
            const trailing = address.substring(address.length - short_chars);
            const shortAddress = leading + "..." + trailing;
            setMyAddressDisplay(shortAddress);

            const balance = await bridge_balance({ address: address });
            setMyBalance(balance.balance);
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
