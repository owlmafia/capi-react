import funds from "../images/funds.svg";

export const LabeledInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">{label}</div>
      <div className="labeled_input__error">{errorMsg}</div>
      {input(inputValue, onChange, placeholder)}
    </div>
  );
};

export const LabeledCurrencyInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">{label}</div>
      <div className="labeled_input__error">{errorMsg}</div>
      <div className="input_with_currency__container">
        {input(inputValue, onChange, placeholder)}
        <img src={funds} alt="funds" />
      </div>
    </div>
  );
};

const input = (inputValue, onChange, placeholder) => {
  return (
    <input
      className="label-input-style"
      placeholder={placeholder}
      size="30"
      value={inputValue}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
};
