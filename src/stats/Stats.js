import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../income_spending_box/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../shares_distribution_box/SharesDistributionBox";
import { init } from "./controller";

export const Stats = ({ deps }) => {
  let params = useParams();

  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading dao id: " + JSON.stringify(params));
      await init(deps, params.id, setDao);
    }
    asyncInit();
  }, [params.id, deps.statusMsg]);

  return (
    <div>
      {dao && <SharesDistributionBox deps={deps} />}

      <IncomeVsSpendingBox statusMsg={deps.statusMsg} daoId={params.id} />
    </div>
  );
};
