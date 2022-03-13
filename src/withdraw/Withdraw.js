import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  LabeledCurrencyInput,
  LabeledInput,
} from "../common_comps/LabeledInput";
import { DaoName } from "../ContentTitle";
import { Funds } from "../dao/Funds";
import { init, withdraw, updateFunds_ } from "./controller";

export const Withdrawal = (props) => {
  let params = useParams();

  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [dao, setDao] = useState(null);

  const [funds, setFunds] = useState(null);

  const updateFunds = useCallback(async () => {
    await updateFunds_(params.id, null, setFunds, props.statusMsg);
  }, [params.id, props.statusMsg]);

  useEffect(() => {
    async function asyncInit() {
      // init(params.id, props.history.location.state, setDAo, props.statusMsg);
      await init(params.id, null, setDao, props.statusMsg);
      await updateFunds();
    }
    asyncInit();
  }, [params.id, props.statusMsg, updateFunds]);

  const view = () => {
    if (dao) {
      return (
        <div>
          <DaoName dao={dao} />
          <Funds
            funds={funds}
            showWithdrawLink={false}
            daoId={params.id}
            containerClassNameOpt="dao_funds__cont_in_withdraw"
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
