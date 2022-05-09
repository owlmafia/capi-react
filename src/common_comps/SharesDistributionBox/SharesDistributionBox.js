import React, { useEffect, useState } from "react";
import { SharesDistributionChart } from "../../charts/SharesDistributionChart";
import { LabeledBox } from "../../common_comps/LabeledBox";
import { fetchSharesDistribution } from "./controller";
import { HolderEntry } from "./HolderEntry";

// Currently contains only a labeled chart but later could contain also e.g. list of holders / top holders
export const SharesDistributionBox = ({
  statusMsg,
  sharesAssetId,
  sharesSupply,
  appId,
  holderCount,
}) => {
  const [sharesDistr, setSharesDistr] = useState([]);
  const [showMoreSelected, setShowMoreSelected] = useState(false);
  // used to highlight the address on the right side
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [entries, setEntries] = useState(sharesDistr);

  const entries_small_count = 3;

  useEffect(() => {
    async function fetchData() {
      if (sharesAssetId && sharesSupply) {
        const sharesDistr = await fetchSharesDistribution(
          statusMsg,
          sharesAssetId,
          sharesSupply,
          appId
        );
        setSharesDistr(sharesDistr);
      }
    }
    fetchData();
  }, [statusMsg, sharesAssetId, sharesSupply, appId]);

  const showAll = () => {
    return showMoreSelected || sharesDistr.length <= entries_small_count;
  };

  const filterHolders = (startIndex) => {
    let min = Math.min(sharesDistr.length, entries_small_count);
    const holders = sharesDistr.slice(startIndex, startIndex + min);
    return holders;
  };

  useEffect(() => {
    if (showAll()) {
      setEntries(sharesDistr);
    } else {
      // collapsed
      var startIndex = 0;
      if (selectedAddress) {
        startIndex = sharesDistr.findIndex((d) => d.address == selectedAddress);
      }
      setEntries(filterHolders(startIndex));
    }
  }, [
    statusMsg,
    sharesAssetId,
    sharesDistr,
    showMoreSelected,
    selectedAddress,
  ]);

  const showMoreOrLessFooter = () => {
    // not enough entries for collapsing: no footer needed
    if (sharesDistr.length <= entries_small_count) {
      return null;
    }

    // since we discarded not enough entries case, showMore: true -> "show more", showMore: false -> "show less"
    let showMore = !showMoreSelected;
    return (
      <div
        className="link_button"
        onClick={() => setShowMoreSelected(showMore)}
      >
        {showMore ? "Show more" : "Show less"}
      </div>
    );
  };

  const holdersListItems = () => {
    if (sharesDistr.length > 0) {
      return (
        <div className="holder_list_container">
          <div className="sub-title">Investors {entries.length}</div>
          {entries.map((entry) => {
            return (
              <HolderEntry
                entry={entry}
                isSelected={entry.address === selectedAddress}
              />
            );
          })}
          {showMoreOrLessFooter()}
        </div>
      );
    } else {
      return null;
    }
  };

  const content = () => {
    if (sharesDistr && sharesDistr.length === 0) {
      return <div>{"No investors yet"}</div>;
    } else {
      return (
        <div className="investors-container">
          <div>
            <div className="sub-title">Available Shares 1200</div>
          </div>
          <SharesDistributionChart
            sharesDistr={sharesDistr}
            onAddressSelected={(address) => {
              const addressIndex = sharesDistr.findIndex(
                (d) => d.address == address
              );
              // toggle selected state
              let newSelected = !sharesDistr[addressIndex].isSelected;

              // clear selection
              sharesDistr.forEach((share) => (share.isSelected = false));
              sharesDistr[addressIndex].isSelected = newSelected;

              // set selected address (for address list) - if it was deselected, it's cleared
              const selection = newSelected ? address : null;
              setSelectedAddress(selection);

              return newSelected;
            }}
          />
          {holdersListItems()}
        </div>
      );
    }
  };

  return <LabeledBox label={"Investors distribution"}>{content()}</LabeledBox>;
};
