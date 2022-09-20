import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { loadFundsActivity } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";
import Progress from "../common_comps/Progress";
import { SubmitButton } from "../common_comps/SubmitButton";

export const FundsActivity = ({ deps }) => {
  let params = useParams();

  const [activityEntries, setActivityEntries] = useState(null);

  useEffect(() => {
    loadFundsActivity(deps.statusMsg, params.id, setActivityEntries, null);
  }, [params.id, deps.statusMsg]);

  const fundsActivity = () => {
    if (activityEntries) {
      if (activityEntries.length > 0) {
        return (
          <div>
            {activityEntries &&
              activityEntries.map((entry) => (
                <FundsActivityEntry
                  deps={deps}
                  entry={entry}
                  showDescr={true}
                  key={entry.tx_id}
                />
              ))}
          </div>
        );
      } else {
        return <NoActivityView daoId={params.id} />;
      }
    } else {
      return <Progress />;
    }
  };

  const view = () => {
    return (
      <div className="mt-80 mb-80">
        <ContentTitle title={"Funds activity"} />
        <div className="mt-40">{fundsActivity()}</div>
      </div>
    );
  };

  return <div>{view()}</div>;
};

const NoActivityView = ({ daoId }) => {
  return (
    <div className="d-flex w-100 justify-center">
      <div className="no-activity">
        <div className="title mb-6">{"No activity yet"}</div>
        <div className="ft-weight-600 grey-190">
          {"Let's make some investments!"}
        </div>
        <Link className="text-center w-100" to={"/" + daoId}>
          <SubmitButton
            label={"Buy shares"}
            className="button-primary w-100"
            onClick={async () => {}}
          />
        </Link>
      </div>
    </div>
  );
};
