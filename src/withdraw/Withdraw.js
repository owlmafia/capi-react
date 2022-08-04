import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Progress from "../app_comps/Progress";
import { SubmitButton } from "../app_comps/SubmitButton";
import {
  LabeledCurrencyInput,
  LabeledTextArea,
} from "../common_comps/LabeledInput";
import { Funds } from "../dao/Funds";
import { init, withdraw } from "./controller";
import pencil from "../images/svg/pencil.svg";
import funds from "../images/funds.svg";

export const Withdrawal = ({ deps }) => {
  let params = useParams();

  const [withdrawalAmount, setWithdrawalAmount] = useState("10");
  const [withdrawalDescr, setWithdrawalDescr] = useState("Type the reason");
  const [dao, setDao] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function asyncInit() {
      // init(params.id, props.history.location.state, setDao, props.statusMsg);
      await init(deps, params.id, null, setDao);
    }
    asyncInit();
  }, [params.id, setDao, deps.statusMsg]);

  const view = () => {
    if (dao) {
      return (
        <div className="box-container mt-80">
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
            img={funds}
            onChange={(input) => setWithdrawalAmount(input)}
          />
          <LabeledTextArea
            className="textarea-withdraw"
            label={"For what?"}
            img={pencil}
            inputValue={withdrawalDescr}
            onChange={(input) => setWithdrawalDescr(input)}
            maxLength={200} // NOTE: has to match WASM
            rows={3}
          />

          <SubmitButton
            label={"Withdraw"}
            className="button-primary"
            isLoading={submitting}
            disabled={deps.myAddress === ""}
            onClick={async () => {
              await withdraw(
                deps,
                setSubmitting,
                params.id,
                withdrawalAmount,
                withdrawalDescr
              );
            }}
          />
        </div>
      );
    } else {
      return <Progress />;
    }
  };

  return <div>{view()}</div>;
};
