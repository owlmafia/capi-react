import { Outlet } from "react-router-dom";

export const OuterWireframe = ({ myAddress, myAddressDisplay, myBalance }) => {
  return (
    <div>
      {yourAddressView(myAddress, myAddressDisplay, myBalance)}
      <Outlet />
    </div>
  );
};

const yourAddressView = (myAddress, myAddressDisplay, myBalance) => {
  if (myAddress !== "") {
    return (
      <div id="user-data">
        {/* <div>{"Your address:"}</div> */}
        <div className="your-address">
          <a
            href={"https://testnet.algoexplorer.io/address/" + myAddress}
            target="_blank"
            rel="noreferrer"
          >
            {myAddressDisplay}
          </a>
        </div>
        <div id="my-balance">{myBalance}</div>
      </div>
    );
  } else {
    return null;
  }
};
