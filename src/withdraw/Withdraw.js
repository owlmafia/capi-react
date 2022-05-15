import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LabeledCurrencyInput,
  LabeledInput,
} from "../common_comps/LabeledInput";
import { Funds } from "../dao/Funds";
import { init, withdraw } from "./controller";

export const Withdrawal = ({ deps }) => {
  let params = useParams();

  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("Type the reason");
  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      // init(params.id, props.history.location.state, setDao, props.statusMsg);
      await init(params.id, null, setDao, deps.statusMsg);
    }
    asyncInit();
  }, [params.id, setDao, deps.statusMsg]);

  const view = () => {
    if (dao) {
      return (
        <div className="box-container">
          <div className="title">Withdraw Funds from project</div>
          {/* <DaoName dao={dao} /> */}
          <Funds
            funds={deps.funds}
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
            disabled={deps.myAddress === ""}
            onClick={async () => {
              await withdraw(
                deps.myAddress,
                deps.showProgress,
                deps.statusMsg,
                deps.updateMyBalance,
                params.id,
                withdrawalAmount,
                withdrawalDescr,
                deps.updateFunds
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
