import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  LabeledCurrencyInput,
  LabeledInput,
} from "../common_comps/LabeledInput";
import { ProjectName } from "../ContentTitle";
import { Funds } from "../project/Funds";
import { init, withdraw, updateFunds_ } from "./controller";

export const Withdrawal = (props) => {
  let params = useParams();

  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [project, setProject] = useState(null);

  const [funds, setFunds] = useState(null);

  const updateFunds = useCallback(async () => {
    await updateFunds_(params.id, null, setFunds, props.statusMsg);
  }, []);

  useEffect(() => {
    async function asyncInit() {
      // TODO pass cached project (props.history.location.state)? not sure this is still needed, with the new navigation
      // init(params.id, props.history.location.state, setProject, props.statusMsg);
      await init(params.id, null, setProject, props.statusMsg);
      await updateFunds();
    }
    asyncInit();
    // }, [props.history.location.state, params.id, props.statusMsg]);
  }, [params.id, props.statusMsg]);

  const view = () => {
    if (project) {
      return (
        <div>
          <ProjectName project={project} />
          <Funds
            funds={funds}
            showWithdrawLink={false}
            projectId={params.id}
            containerClassNameOpt="project_funds__cont_in_withdraw"
          />
          <LabeledCurrencyInput
            label={"How much?"}
            inputValue={withdrawalAmount}
            onChange={(input) => setWithdrawalAmount(input)}
          />
          <LabeledInput
            label={"For what?"}
            inputValue={withdrawalDescr}
            onChange={(input) => setWithdrawalDescr(input)}
          />
          <button
            className="button__submit"
            disabled={props.myAddress === ""}
            onClick={async () => {
              await withdraw(
                props.myAddress,
                props.showProgress,
                props.statusMsg,
                props.updateMyBalance,
                params.id,
                withdrawalAmount,
                withdrawalDescr,
                updateFunds
              );
            }}
          >
            {"Withdraw"}
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  return <div>{view()}</div>;
};
