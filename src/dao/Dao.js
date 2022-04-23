import React, { useEffect, useMemo, useState, useCallback } from "react";
import { BsShare as ShareIcon } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../common_comps/IncomeVsSpendingBox/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../common_comps/SharesDistributionBox/SharesDistributionBox";
import { fetchHolderCount } from "../common_functions/stats_common";
import { DaoName } from "../ContentTitle";
import { InvestEmbedded } from "../investEmbedded/InvestEmbedded";
import { PayEmbedded } from "../payEmbedded/PayEmbedded";
import { init, updateFunds_ } from "./controller";
import { Funds } from "./Funds";
import Modal from "../Modal";

export const Dao = (props) => {
  let params = useParams();

  const [viewDao, setViewDao] = useState(null);
  const [funds, setFunds] = useState(null);

  const [holderCount, setHolderCount] = useState(null);

  const [showInvestTab, setShowInvestTab] = useState(false);
  const [showPayTab, setShowPayTab] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);

  console.log("props: " + JSON.stringify(props));

  const dao = useMemo(() => {
    if (viewDao) {
      return viewDao.dao;
    }
  }, [viewDao]);

  const updateFunds = useCallback(async () => {
    await updateFunds_(params.id, setViewDao, setFunds, props.statusMsg);
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    async function asyncInit() {
      await init(params.id, setViewDao, setFunds, props.statusMsg);
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

  const actions_tabs_classes = (tabIsShowing) => {
    var clazz = "link_button";
    if (tabIsShowing) {
      clazz += " dao_action_tab_item__sel";
    }
    return clazz;
  };

  const daoView = () => {
    if (viewDao) {
      return (
        <div>
          <div>
            <DaoName dao={viewDao.dao}>
              <ShareIcon
                className="title_right_button"
                onClick={() => setShowShareModal((visible) => !visible)}
              />
            </DaoName>

            <div id="dao_description">{viewDao.dao.description}</div>

            <div id="dao_actions_top_bar">
              <p
                className={actions_tabs_classes(showInvestTab)}
                onClick={() => {
                  setShowPayTab(false);
                  setShowInvestTab((current) => !current);
                }}
              >
                {"Invest"}
              </p>
              <p
                className={actions_tabs_classes(showPayTab)}
                onClick={() => {
                  setShowInvestTab(false);
                  setShowPayTab((current) => !current);
                }}
              >
                {"Pay"}
              </p>
              <Funds
                funds={funds}
                showWithdrawLink={
                  props.myAddress &&
                  viewDao.dao.owner_address &&
                  viewDao.dao.owner_address === props.myAddress
                }
                daoId={params.id}
              />
            </div>
            {showInvestTab && (
              <InvestEmbedded
                showProgress={props.showProgress}
                statusMsg={props.statusMsg}
                updateMyBalance={props.updateMyBalance}
                myAddress={props.myAddress}
                dao={dao}
                updateMyShares={props.updateMyShares}
                myShares={props.myShares}
                updateFunds={updateFunds}
              />
            )}
            {showPayTab && (
              <PayEmbedded
                showProgress={props.showProgress}
                statusMsg={props.statusMsg}
                updateMyBalance={props.updateMyBalance}
                myAddress={props.myAddress}
                dao={dao}
                updateFunds={updateFunds}
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

  return (
    <div>
      {daoView()}
      {showShareModal && (
        <Modal
          title={"Share dao"}
          onCloseClick={() => setShowShareModal(false)}
        >
          <div>{"TODO Social media buttons to share this dao"}</div>
        </Modal>
      )}
    </div>
  );
};
