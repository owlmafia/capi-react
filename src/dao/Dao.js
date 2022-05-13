import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { fetchHolderCount } from "../common_functions/stats_common";
import { InvestEmbedded } from "../investEmbedded/InvestEmbedded";
import { init } from "./controller";
import { updateInvestmentData_ } from "../shared_functions";

export const Dao = (props) => {
  let params = useParams();

  const [viewDao, setViewDao] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);

  const [holderCount, setHolderCount] = useState(null);

  console.log("props: " + JSON.stringify(props));

  const dao = useMemo(() => {
    if (viewDao) {
      return viewDao.dao;
    }
  }, [viewDao]);

  useEffect(() => {
    async function asyncInit() {
      await init(params.id, setViewDao, props.statusMsg);
    }
    asyncInit();
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    if (dao) {
      fetchHolderCount(
        props.statusMsg,
        dao.shares_asset_id,
        dao.app_id,
        setHolderCount
      );
    }
  }, [props.statusMsg, dao]);

  useEffect(() => {
    async function nestedAsync() {
      if (props.myAddress) {
        await updateInvestmentData_(
          props.statusMsg,
          props.myAddress,
          params.id,
          setInvestmentData
        );
      }
    }
    nestedAsync();
  }, [props.statusMsg, props.myAddress, params.id]);

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

            {investmentData && (
              <InvestEmbedded
                showProgress={props.showProgress}
                statusMsg={props.statusMsg}
                updateMyBalance={props.updateMyBalance}
                myAddress={props.myAddress}
                dao={dao}
                investmentData={investmentData}
                updateMyShares={props.updateMyShares}
                myShares={props.myShares}
                updateFunds={props.updateFunds}
              />
            )}

            {/* <Link
              disabled={props.myAddress === "" || funds === 0}
              hidden={viewDao.dao.owner_address !== props.myAddress}
              to={"/withdraw/" + params.id}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
            <div className="section-spacer" />
            {dao && (
              <SharesDistributionBox
                statusMsg={props.statusMsg}
                sharesAssetId={sharesAssetId}
                sharesSupply={sharesSupply}
                holderCount={holderCount}
                appId={dao.app_id}
              />
            )}

            <IncomeVsSpendingBox
              statusMsg={props.statusMsg}
              daoId={params.id}
            />
          </div>
          <div className="section-spacer" />
        </div>
      );
    } else {
      return null;
    }
  };

  return <div>{daoView()}</div>;
};
