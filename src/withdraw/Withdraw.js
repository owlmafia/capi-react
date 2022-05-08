import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  LabeledCurrencyInput,
  LabeledInput,
} from "../common_comps/LabeledInput";
import { Funds } from "../dao/Funds";
import { init, withdraw } from "./controller";

export const Withdrawal = (props) => {
  let params = useParams();

  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("foo bar");
  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      // init(params.id, props.history.location.state, setDAo, props.statusMsg);
      await init(params.id, null, setDao, props.statusMsg);
    }
    asyncInit();
  }, [params.id, props.statusMsg]);

  const view = () => {
    if (dao) {
      return (
        <div className="box-container">
          <div className="title">Withdraw Funds from project</div>
          {/* <DaoName dao={dao} /> */}
          <Funds
            funds={props.funds}
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
            className="button-primary"
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
                props.updateFunds
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
