import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { fetchHolderCount } from "../common_functions/stats_common";
import { InvestEmbedded } from "../investEmbedded/InvestEmbedded";
import { init } from "./controller";
import { updateInvestmentData_ } from "../shared_functions";
import Progress from "../app_comps/Progress";

export const Dao = ({ deps }) => {
  let params = useParams();

  const [viewDao, setViewDao] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);

  const [holderCount, setHolderCount] = useState(null);

  console.log("deps: " + JSON.stringify(deps));

  const dao = useMemo(() => {
    if (viewDao) {
      return viewDao.dao;
    }
  }, [viewDao]);

  useEffect(() => {
    async function asyncInit() {
      await init(params.id, setViewDao, deps.statusMsg);
    }
    asyncInit();
  }, [params.id, deps.statusMsg]);

  useEffect(() => {
    if (dao) {
      fetchHolderCount(
        deps.statusMsg,
        dao.shares_asset_id,
        dao.app_id,
        setHolderCount
      );
    }
  }, [deps.statusMsg, dao]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.myAddress) {
        await updateInvestmentData_(
          deps.statusMsg,
          deps.myAddress,
          params.id,
          setInvestmentData
        );
      }
    }
    nestedAsync();
  }, [deps.statusMsg, deps.myAddress, params.id]);

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

  const daoView = () => {
    if (viewDao) {
      return (
        <div>
          <div>
            <div id="dao_description">{viewDao.dao.description}</div>

            {investmentData && <InvestEmbedded deps={deps} dao={dao} />}

            {/* <Link
              disabled={deps.myAddress === "" || funds === 0}
              hidden={viewDao.dao.owner_address !== deps.myAddress}
              to={"/withdraw/" + params.id}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
            <div className="section-spacer" />
            {dao && (
              <SharesDistributionBox
                deps={deps}
                sharesAssetId={sharesAssetId}
                sharesSupply={sharesSupply}
                holderCount={holderCount}
                appId={dao.app_id}
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
