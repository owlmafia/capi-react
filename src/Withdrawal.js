import moment from "moment";
export const WithdrawalEntry = ({ withdrawal }) => {
  const finalWithdrawalDateStr = (dateStr) => {
    // the withdrawal can be a date or text like "just now"
    // we don't format the date in rust, because it requires additional libraries which have issues on WASM
    // (don't remember exactly - may be not supported or build size. Also might have not checked enough libraries).
    if (moment(withdrawal.date).isValid()) {
      return moment(withdrawal.date).format("LLL");
    } else {
      return withdrawal.date;
    }
  };

  return (
    <div key={withdrawal.tx_id} className="withdrawal-cell">
      <p>
        <span className="key-val-key">{"Tx id:"}</span>
        <span className="key-val-val">
          <a href={withdrawal.tx_link}>{withdrawal.tx_id}</a>
        </span>
      </p>
      <p>
        <span className="key-val-key">{"Date:"}</span>
        <span className="key-val-val">
          {finalWithdrawalDateStr(withdrawal.date)}
        </span>
      </p>
      <p>
        <span className="key-val-key">{"Amount:"}</span>
        <span className="key-val-val">{withdrawal.amount}</span>
      </p>
      <p>
        <span className="key-val-key">{"Description:"}</span>
        <span className="key-val-val">{withdrawal.description}</span>
      </p>
    </div>
  );
};
