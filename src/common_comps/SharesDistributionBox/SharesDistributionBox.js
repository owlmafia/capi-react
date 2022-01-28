import { fetchSharesDistribution } from "./controller";
import { LabeledBox } from "../../common_comps/LabeledBox";
import { SharesDistributionChart } from "../../charts/SharesDistributionChart";
import React, { useEffect, useState } from "react";

// Currently contains only a labeled chart but later could contain also e.g. list of holders / top holders
export const SharesDistributionBox = ({
  statusMsg,
  sharesAssetId,
  sharesSupply,
  holderCount,
}) => {
  const [sharesDistr, setSharesDistr] = useState(null);

  useEffect(async () => {
    if (sharesAssetId && sharesSupply) {
      const sharesDistr = await fetchSharesDistribution(
        statusMsg,
        sharesAssetId,
        sharesSupply
      );
      setSharesDistr(sharesDistr);
    }
  }, [sharesAssetId, sharesSupply]);

  return (
    <LabeledBox label={"Holders distribution"}>
      <SharesDistributionChart sharesDistr={sharesDistr} />
      <p>
        <span className="key-val-key">{"Total:"}</span>
        <span className="key-val-val">{holderCount}</span>
      </p>
    </LabeledBox>
  );
};
