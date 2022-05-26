import React, { useEffect, useState, useCallback } from "react";
import { SharesDistributionChart } from "../../charts/SharesDistributionChart";
import { LabeledBox } from "../../common_comps/LabeledBox";
import { fetchSharesDistribution } from "./controller";
import { HolderEntry } from "./HolderEntry";
import green from "../../images/svg/green-arrow.svg";
import Progress from "../../app_comps/Progress";

// Currently contains only a labeled chart but later could contain also e.g. list of holders / top holders
export const SharesDistributionBox = ({
  deps,
  sharesAssetId,
  sharesSupply,
  appId,
}) => {
  const [sharesDistr, setSharesDistr] = useState(null);
  const [showMoreSelected, setShowMoreSelected] = useState(false);
  // used to highlight the address on the right side
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [entries, setEntries] = useState(sharesDistr);

  const entries_small_count = 3;

  useEffect(() => {
    async function fetchData() {
      if (sharesAssetId && sharesSupply) {
        const sharesDistr = await fetchSharesDistribution(
          deps.statusMsg,
          sharesAssetId,
          sharesSupply,
          appId
        );
        setSharesDistr(sharesDistr);
      }
    }
    fetchData();
  }, [deps.statusMsg, sharesAssetId, sharesSupply, appId]);

  useEffect(() => {
    const showAll = () => {
      return (
        showMoreSelected ||
        (sharesDistr && sharesDistr.length <= entries_small_count)
      );
    };

    const filterHolders = (startIndex) => {
      if (!sharesDistr) return null;

      let min = Math.min(sharesDistr.length, entries_small_count);
      const holders = sharesDistr.slice(startIndex, startIndex + min);
      return holders;
    };

    if (showAll()) {
      setEntries(sharesDistr);
    } else {
      // collapsed
      var startIndex = 0;
      if (selectedAddress) {
        startIndex = sharesDistr.findIndex(
          (d) => d.address === selectedAddress
        );
      }
      setEntries(filterHolders(startIndex));
    }
  }, [
    deps.statusMsg,
    sharesAssetId,
    sharesDistr,
    showMoreSelected,
    selectedAddress,
  ]);

  const onAddressSelected = useCallback(
    (address) => {
      const addressIndex = sharesDistr.findIndex((d) => d.address === address);
      // toggle selected state
      let newSelected = !sharesDistr[addressIndex].isSelected;

      // clear selection
      sharesDistr.forEach((share) => (share.isSelected = false));
      sharesDistr[addressIndex].isSelected = newSelected;

      // set selected address (for address list) - if it was deselected, it's cleared
      const selection = newSelected ? address : null;
      setSelectedAddress(selection);

      return newSelected;
    },
    [sharesDistr, setSelectedAddress]
  );

  const showMoreOrLessFooter = () => {
    // not enough entries for collapsing: no footer needed
    if (sharesDistr && sharesDistr.length <= entries_small_count) {
      return null;
    }

    // since we discarded not enough entries case, showMore: true -> "show more", showMore: false -> "show less"
    let showMore = !showMoreSelected;
    return (
      <button
        className="link_button"
        onClick={() => setShowMoreSelected(showMore)}
      >
        {showMore ? "See all" : "Show less"}
      </button>
    );
  };

  const holdersListItems = () => {
    if (sharesDistr && sharesDistr.length > 0 && entries) {
      return (
        <div className="holder_list_container">
          <div className="sub-title">
            Investors {sharesDistr.length}
            <img src={green} alt="arrow" />
          </div>
          {entries.map((entry) => {
            return (
              <HolderEntry
                key={entry.label}
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
      return <Progress vCenter={false} />;
    } else {
      return (
        <div className="investors-container">
          <div className="d-flex flex-column flex-wrap">
            <div className="sub-title">Available Shares 1200</div>
            <div className="flexBlock">
              <div className="ft-weight-600">15</div>
              <div className="circle ml-5 mr-3"></div>
              <div className="ft-color-black ft-size-14">Unlocked Share</div>
            </div>
            <div className="flexBlock">
              <div className="ft-weight-600">15</div>
              <div className="circle ml-5 mr-3"></div>
              <div className="ft-color-black ft-size-14">
                Your Unlocked Share
              </div>
            </div>
          </div>
          <div className="pie-chart-container">
            <SharesDistributionChart
              sharesDistr={sharesDistr}
              onAddressSelected={onAddressSelected}
            />
          </div>
          {holdersListItems()}
        </div>
      );
    }
  };

  return (
    <div id="investors-distribution">
      <LabeledBox label={"Investors distribution"}>{content()}</LabeledBox>
    </div>
  );
};
