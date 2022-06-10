export const BuyAlgosContent = () => {
  return (
    <div>
      <div>
        <span>
          {"You don't have enough Algos to pay for the transaction fees ("}
        </span>
        <span className="ft-weight-bold">{"less than $0.01"}</span>
        <span>{" in total!)"}</span>
      </div>
      <div>
        {
          "Continue to be directed to a payment provider, where you can buy Algos with a credit card or Apple Pay."
        }
      </div>
    </div>
  );
};
