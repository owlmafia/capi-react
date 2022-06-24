import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SharesDistributionChart } from "../../charts/SharesDistributionChart";
import { LabeledBox } from "../../common_comps/LabeledBox";
import { fetchHoldersChange, fetchSharesDistribution } from "./controller";
import { HolderEntry } from "./HolderEntry";
import Progress from "../../app_comps/Progress";
import { pieChartColors } from "../../common_functions/common";
import { changeArrow } from "../../shared_functions";

// Currently contains only a labeled chart but later could contain also e.g. list of holders / top holders
export const SharesDistributionBox = ({
  deps,
  sharesAssetId,
  sharesSupply,
  appId,
}) => {
  const [sharesDistr, setSharesDistr] = useState(null);
  const [notOwnedShares, setNotOwnedShares] = useState(null);
  const [holdersChange, setHoldersChange] = useState(null);

  const [showMoreSelected, setShowMoreSelected] = useState(false);
  // used to highlight the address on the right side
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [entries, setEntries] = useState(sharesDistr);

  const entries_small_count = 3;

  useEffect(() => {
    async function fetchData() {
      if (sharesAssetId && sharesSupply) {
        await fetchSharesDistribution(
          deps.statusMsg,
          sharesAssetId,
          sharesSupply,
          appId,
          setSharesDistr,
          setNotOwnedShares
        );
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

  useEffect(() => {
    async function nestedAsync() {
      if (appId) {
        await fetchHoldersChange(
          deps.statusMsg,
          sharesAssetId,
          appId,
          setHoldersChange
        );
      }
    }
    nestedAsync();
  }, [deps.statusMsg, sharesAssetId, appId]);

  const col = useMemo(() => {
    return pieChartColors();
  }, []);

  const color = (index) => {
    return col[Math.round(index % col.length)];
  };

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
    if (sharesDistr && entries) {
      return (
        <div className="holder_list_container">
          <div className="flexBlock">
            <span className="ft-size-18 ft-weight-600 mr-12">{"Investors"}</span>
            <span className="ft-size-24 ft-weight-700">{sharesDistr.length}</span>
            <div>{changeArrow(deps.fundsChange)}</div>
          </div>
          {entries.map((entry) => {
            // not owned is shown on the left side, so we remove the entry from the list here
            // note that we keep it in the original list, because it's also used for the chart, where we show not owned
            if (entry.type_ === "not_owned") {
              return null;
            } else {
              return (
                <HolderEntry
                  key={entry.label}
                  entry={entry}
                  isSelected={entry.address === selectedAddress}
                  // use original index (not filtered holders) to get chart segment color
                  col={color(entry.originalIndex)}
                />
              );
            }
          })}
          {showMoreOrLessFooter()}
        </div>
      );
    } else {
      return null;
    }
  };

  const content = () => {
    if (entries === null) {
      return <Progress vCenter={false} />;
    } else {
      return (
        <LabeledBox label={"Investor distribution"}>
          <div className="investors-container">
            <div className="d-flex flex-column">
              <div className="d-flex flex-column flex-wrap">
                <div className="flexBlock">
                  <div className="mr-12 ft-size-18 ft-weight-600 nowrap">{"Total shares"}</div>
                  <div className="ft-size-24 ft-weight-700">{sharesSupply}</div>
                  <div>
                  </div>
                </div>
                <div className="d-flex align-center">
                  <div className="ft-size-18 ft-weight-600">{notOwnedShares}</div>
                  <div className="circle ml-5 mr-3"></div>
                  <div className="ft-color-black">{"Available for sale"}</div>
                </div>
              </div>
              <div className="d-none d-tablet-block">{holdersListItems()}</div>
            </div>
            <div className="pie_chart__container">
              <SharesDistributionChart
                sharesDistr={sharesDistr}
                onAddressSelected={onAddressSelected}
                col={col}
                animated={true}
              />
            </div>
            <div className="d-tablet-none">{holdersListItems()}</div>
          </div>
        </LabeledBox>
      );
    }
  };

  return <div className="mt-80" id="investors-distribution">{content()}</div>;
};
