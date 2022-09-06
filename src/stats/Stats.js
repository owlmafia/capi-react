import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../income_spending_chart/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../shares_distribution_chart/SharesDistributionBox";
import { init } from "./controller";

export const Stats = ({ deps }) => {
  let params = useParams();

  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading dao id: " + JSON.stringify(params));
      await init(deps.statusMsg, params.id, setDao);
    }
    asyncInit();
  }, [deps.statusMsg, params.id]);

  return (
    <div>
      {dao && <SharesDistributionBox deps={deps} />}

      <IncomeVsSpendingBox statusMsg={deps.statusMsg} daoId={params.id} />
    </div>
  );
};
