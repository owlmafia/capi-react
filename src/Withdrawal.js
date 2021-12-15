import moment from "moment";
export const WithdrawalEntry = ({ withdrawal }) => {
  return (
    // TODO db id maybe? - or ensure backend uses this as unique
    <div
      key={withdrawal.date + withdrawal.description}
      className="withdrawal-cell"
    >
      <p>
        <span className="key-val-key">{"Date:"}</span>
        <span className="key-val-val">
          {moment(withdrawal.date).format("LLL")}
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
