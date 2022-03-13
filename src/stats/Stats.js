import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { fetchHolderCount } from "../common_functions/stats_common";
import { ContentTitle } from "../ContentTitle";
import { init } from "./controller";

export const Stats = ({ statusMsg }) => {
  let params = useParams();

  const [holderCount, setHolderCount] = useState(null);
  const [viewDao, setViewDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading dao id: " + JSON.stringify(params));
      await init(params.id, setViewDao, statusMsg);
    }
    asyncInit();
  }, [params.id, statusMsg]);

  const dao = useMemo(() => {
    if (viewDao) {
      return viewDao.dao;
    }
  }, [viewDao]);

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

  useEffect(() => {
    if (sharesAssetId && dao) {
      fetchHolderCount(
        statusMsg,
        sharesAssetId,
        dao.investing_escrow_address,
        dao.locking_escrow_address,
        setHolderCount
      );
    }
  }, [statusMsg, sharesAssetId, dao]);

  return (
    <div>
      <div>
        <ContentTitle title={"Stats"} />
      </div>
      {dao && (
        <SharesDistributionBox
          statusMsg={statusMsg}
          sharesAssetId={sharesAssetId}
          sharesSupply={sharesSupply}
          holderCount={holderCount}
          appId={dao.central_app_id}
          investingEscrowAddress={dao.investing_escrow_address}
          lockingEscrowAddress={dao.locking_escrow_address}
        />
      )}

      <IncomeVsSpendingBox statusMsg={statusMsg} daoId={params.id} />
    </div>
  );
};
