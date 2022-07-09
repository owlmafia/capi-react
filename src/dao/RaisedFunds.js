import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Progress from "../app_comps/Progress";
import renderFundsProgressChart from "../charts/renderFundsBarChart";
import { loadRaisedFunds } from "./controller";

export const RaisedFunds = ({ deps, dao }) => {
  let params = useParams();

  const [raisedFunds, setRaisedFunds] = useState(null);
  const [raisedFundsNumber, setRaisedFundsNumber] = useState(null);
  const [raiseState, setRaiseState] = useState(null);

  const chart = useRef(null);

  console.log("deps: " + JSON.stringify(deps));

  useEffect(() => {
    async function nestedAsync() {
      loadRaisedFunds(
        deps.statusMsg,
        params.id,
        setRaisedFunds,
        setRaisedFundsNumber,
        setRaiseState
      );
    }
    nestedAsync();
  }, [params.id, dao, deps.statusMsg]);

  useEffect(() => {
    if (dao && raisedFunds) {
      renderFundsProgressChart(
        chart.current,
        dao,
        raisedFunds,
        raisedFundsNumber,
        raiseState?.success ?? true // no state (still raising) has same colors as successful
      );
    }
  }, [dao, raisedFunds, raisedFundsNumber, raiseState]);

  const view = () => {
    // if (deps.dao && raisedFunds && raisedFundsNumber) {
    if (deps.dao) {
      return (
        <div>
          {/* debug */}
          {/* <div>{"Raised funds: " + raisedFunds}</div>
          <div>{"Raised funds number: " + raisedFundsNumber}</div>
          <div>{"End date: " + dao.raise_end_date}</div>
          <div>{"Min target: " + dao.raise_min_target}</div>
          <div>{"Min target number: " + dao.raise_min_target_number}</div>
          <div>{"Total raisable: " + dao.total_raisable}</div>
          <div>{"Total raisable number: " + dao.total_raisable_number}</div> */}
          <div className="subtitle mb-32">Investing progress</div>

          <div>
            {raiseState && (
              <div
                className={`text-center subtitle mb-12 ${
                  raiseState.success ? "ft-color-cyan" : "ft-color-red"
                }`}
              >
                {raiseState.text}
              </div>
            )}
            <svg ref={chart} />
          </div>
        </div>
      );
    } else {
      return <Progress />;
    }
  };

  return <div>{view()}</div>;
};

const fundsRaiseStateLabel = (raisedFunds, dao) => {
  // const minFunds = dao.raise_min_target_number;
  // if (raisedFunds)
};
