import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { fetchHolderCount } from "../common_functions/stats_common";
import { InvestEmbedded } from "../investEmbedded/InvestEmbedded";
import Progress from "../app_comps/Progress";

export const Dao = ({ deps }) => {
  let params = useParams();

  const [holderCount, setHolderCount] = useState(null);

  console.log("deps: " + JSON.stringify(deps));

  useEffect(() => {
    async function asyncInit() {
      await deps.updateDao.call(null, params.id);
    }
    asyncInit();
  }, [params.id, deps.statusMsg, deps.updateDao]);

  useEffect(() => {
    if (deps.dao) {
      fetchHolderCount(
        deps.statusMsg,
        deps.dao.shares_asset_id,
        deps.dao.app_id,
        setHolderCount
      );
    }
  }, [deps.statusMsg, deps.dao]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.myAddress) {
        await deps.updateInvestmentData.call(null, params.id, deps.myAddress);
      }
    }
    nestedAsync();
  }, [deps.statusMsg, deps.myAddress, params.id, deps.updateInvestmentData]);

  const sharesAssetId = useMemo(() => {
    if (deps.dao) {
      return deps.dao.shares_asset_id;
    }
  }, [deps.dao]);

  const sharesSupply = useMemo(() => {
    if (deps.dao) {
      return deps.dao.share_supply;
    }
  }, [deps.dao]);

  const daoView = () => {
    if (deps.dao) {
      return (
        <div>
          <div>
            <div id="dao_description">{deps.dao.description}</div>

            {deps.investmentData && (
              <InvestEmbedded deps={deps} dao={deps.dao} />
            )}

            {/* <Link
              disabled={deps.myAddress === "" || funds === 0}
              hidden={viewDao.dao.owner_address !== deps.myAddress}
              to={"/withdraw/" + params.id}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
            <div className="section-spacer" />
            {deps.dao && (
              <SharesDistributionBox
                deps={deps}
                sharesAssetId={sharesAssetId}
                sharesSupply={sharesSupply}
                holderCount={holderCount}
                appId={deps.dao.app_id}
              />
            )}

            <IncomeVsSpendingBox statusMsg={deps.statusMsg} daoId={params.id} />
          </div>
          <div className="section-spacer" />
        </div>
      );
    } else {
      return <Progress />;
    }
  };

  return <div>{daoView()}</div>;
};
