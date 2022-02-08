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
  const [viewProject, setViewProject] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading project id: " + JSON.stringify(params));
      await init(params.id, setViewProject, statusMsg);
    }
    asyncInit();
  }, [params.id, statusMsg]);

  const project = useMemo(() => {
    if (viewProject) {
      return viewProject.project;
    }
  }, [viewProject]);

  const sharesAssetId = useMemo(() => {
    if (project) {
      return project.shares_asset_id;
    }
  }, [project]);

  const sharesSupply = useMemo(() => {
    if (project) {
      return project.share_supply;
    }
  }, [project]);

  useEffect(() => {
    if (sharesAssetId) {
      fetchHolderCount(statusMsg, sharesAssetId, setHolderCount);
    }
  }, [statusMsg, sharesAssetId]);

  return (
    <div>
      <div>
        <ContentTitle title={"Stats"} />
      </div>
      {project && (
        <SharesDistributionBox
          statusMsg={statusMsg}
          sharesAssetId={sharesAssetId}
          sharesSupply={sharesSupply}
          holderCount={holderCount}
          appId={project.central_app_id}
          investingEscrowAddress={project.investing_escrow_address}
          stakingEscrowAddress={project.staking_escrow_address}
        />
      )}

      <IncomeVsSpendingBox statusMsg={statusMsg} projectId={params.id} />
    </div>
  );
};
