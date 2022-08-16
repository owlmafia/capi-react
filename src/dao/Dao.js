import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IncomeVsSpendingBox } from "../income_spending_chart/IncomeVsSpendingBox";
import { SharesDistributionBox } from "../shares_distribution_chart/SharesDistributionBox";
import { InvestEmbedded } from "../investEmbedded/InvestEmbedded";
import Progress from "../common_comps/Progress";
import { loadDescription } from "./controller";
import { FundsActivityEmbedded } from "../funds_activity/FundsActivityEmbedded";
import { RaisedFunds } from "./RaisedFunds";

export const Dao = ({ deps }) => {
  let params = useParams();

  const [description, setDescription] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      await deps.updateDao.call(null, params.id);
    }
    asyncInit();
  }, [params.id, deps.statusMsg, deps.updateDao]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.myAddress) {
        await deps.updateInvestmentData.call(null, params.id, deps.myAddress);
      }
    }
    nestedAsync();
  }, [deps.statusMsg, deps.myAddress, params.id, deps.updateInvestmentData]);

  useEffect(() => {
    async function fetch() {
      await loadDescription(deps, setDescription);
    }
    fetch();
  }, [deps.statusMsg, deps.dao, setDescription]);

  const maybeInvestView = (dao) => {
    if (!deps.features.prospectus) {
      return null;
    } else {
      if (dao.prospectus) {
        return <InvestEmbedded deps={deps} dao={dao} />;
      } else {
        return (
          <div>
            {
              "Investing currently is not possible, because the project hasn't added a prospectus."
            }
          </div>
        );
      }
    }
  };

  const daoView = () => {
    if (deps.dao) {
      return (
        <div>
          <div>
            {description && <div id="dao_description">{description}</div>}

            <RaisedFunds deps={deps} dao={deps.dao} />

            {deps.size.s4 && (
              <FundsActivityEmbedded deps={deps} daoId={params.id} />
            )}

            {maybeInvestView(deps.dao)}

            {/* <Link
              disabled={deps.myAddress === "" || funds === 0}
              hidden={viewDao.dao.owner_address !== deps.myAddress}
              to={"/withdraw/" + params.id}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
            {deps.dao && <SharesDistributionBox deps={deps} />}

            {deps.dao && deps.dao && deps.dao.funds_raised === "true" && (
              <IncomeVsSpendingBox
                statusMsg={deps.statusMsg}
                daoId={params.id}
              />
            )}
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
