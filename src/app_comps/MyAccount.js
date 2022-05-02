import React from "react";
import { FundsAssetImg } from "../images/FundsAssetImg";
import { connectWallet } from "../MyAlgo";

export const MyAccount = ({
  myAddress,
  setMyAddress,
  myAddressDisplay,
  setMyAddressDisplay,
  myBalance,
  updateMyBalance,
  statusMsgUpdater,
  // optional: if set, shows "my shares"
  daoId,
  myShares,
}) => {
  return (
    <div className="my-account-container">
      <div class="text">My Algo wallet</div>
      {myAddressView(myAddress, myAddressDisplay, myShares, myBalance)}
      {connectButton(
        myAddress,
        setMyAddress,
        setMyAddressDisplay,
        updateMyBalance,
        statusMsgUpdater
      )}
    </div>
  );
};

const myAddressView = (myAddress, myAddressDisplay, myShares, myBalance) => {
  console.log("Showing my shares: %o", myShares);
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
          <FundsAssetImg />
          <div>{myBalance.balance_funds_asset}</div>
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
        className="button-primary full-width-btn"
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
        className="button-primary full-width-btn"
        onClick={() => {
          setMyAddress("");
        }}
      >
        {"Disconnect"}
      </button>
    );
  }
};
