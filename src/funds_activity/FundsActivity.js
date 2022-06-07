import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ContentTitle } from "../ContentTitle";
import { loadFundsActivity } from "./controller";
import { FundsActivityEntry } from "./FundsActivityEntry";
import Progress from "../app_comps/Progress";
import { SubmitButton } from "../app_comps/SubmitButton";

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
      <div>
        <ContentTitle title={"Funds activity"} />
        {fundsActivity()}
      </div>
    );
  };

  return <div>{view()}</div>;
};

const NoActivityView = ({ daoId }) => {
  return (
    <div>
      <div>{"No activity yet"}</div>
      <div>{"Let's make some investments!"}</div>
      <Link className="see-all" to={"/" + daoId}>
        <SubmitButton
          label={"Buy shares"}
          className="button-primary"
          onClick={async () => {}}
        />
      </Link>
    </div>
  );
};
