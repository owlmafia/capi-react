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
  const [sharesDistr, setSharesDistr] = useState(null);
  const [showMore, setShowMore] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const entries_small_count = 3;

  const holdersListItems = () => {
    if (sharesDistr && sharesDistr.length > 0) {
      var entries = sharesDistr;
      var hasToCollapse = !showMore && sharesDistr.length > entries_small_count;
      if (hasToCollapse) {
        entries = sharesDistr.slice(0, entries_small_count);
      }
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
          {hasToCollapse && (
            <div className="link_button" onClick={() => setShowMore(true)}>
              {"Show more"}
            </div>
          )}
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
            onAddressSelected={setSelectedAddress}
          />
          {holdersListItems()}
        </div>
      );
    }
  };

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

  return <LabeledBox label={"Investors distribution"}>{content()}</LabeledBox>;
};
