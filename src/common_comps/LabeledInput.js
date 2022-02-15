import { FundsAssetImg } from "../images/FundsAssetImg";

export const LabeledInput = ({ label, inputValue, onChange, placeholder }) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">{label}</div>
      {input(inputValue, onChange, placeholder)}
    </div>
  );
};

export const LabeledCurrencyInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">{label}</div>
      <div className="input_with_currency__container">
        {input(inputValue, onChange, placeholder)}
        <FundsAssetImg />
      </div>
    </div>
  );
};

const input = (inputValue, onChange, placeholder) => {
  return (
    <input
      placeholder={placeholder}
      size="30"
      value={inputValue}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
};
