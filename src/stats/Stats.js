import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { init } from "./controller";

export const Stats = ({ deps }) => {
  let params = useParams();

  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading dao id: " + JSON.stringify(params));
      await init(params.id, setDao, deps.statusMsg);
    }
    asyncInit();
  }, [params.id, deps.statusMsg]);

  const sharesAssetId = useMemo(() => {
    if (dao) {
      return dao.shares_asset_id;
    }
  }, [dao]);

  const sharesSupply = useMemo(() => {
    if (dao) {
      return dao.share_supply;
    }
  }, [dao]);

  return (
    <div>
      {dao && (
        <SharesDistributionBox
          deps={deps}
          sharesAssetId={sharesAssetId}
          sharesSupply={sharesSupply}
          appId={dao.app_id}
        />
      )}

      <IncomeVsSpendingBox statusMsg={deps.statusMsg} daoId={params.id} />
    </div>
  );
};
