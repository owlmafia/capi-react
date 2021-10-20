import moment from "moment";
export const WithdrawalRequest = ({
  req,
  buttonDisabled,
  onButtonClick,
  buttonLabel,
}) => {
  return (
    // TODO db id maybe? - or ensure backend uses this as unique
    <div key={req.date + req.description} className="withdrawal-cell">
      <p>
        <span className="key-val-key">{"Date:"}</span>
        <span className="key-val-val">{moment(req.date).format("LLL")}</span>
      </p>
      <p>
        <span className="key-val-key">{"Amount:"}</span>
        <span className="key-val-val">{req.amount}</span>
      </p>
      <p>
        <span className="key-val-key">{"Description:"}</span>
        <span className="key-val-val">{req.description}</span>
      </p>
      <p>
        <span className="key-val-key">{"Votes:"}</span>
        <span className="key-val-val">{req.votes}</span>
      </p>
      <p>
        <span className="key-val-key">{"Complete:"}</span>
        <span className="key-val-val">{req.complete}</span>
      </p>
      {withdrawButton(req, buttonDisabled, onButtonClick, buttonLabel)}
    </div>
  );
};

const withdrawButton = (req, buttonDisabled, onClick, label) => {
  if (req.can_withdraw) {
    return (
      <div>
        <button
          disabled={buttonDisabled}
          onClick={async () => {
            onClick();
          }}
        >
          {label}
        </button>
      </div>
    );
  } else {
    return null;
  }
};
