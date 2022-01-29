export const LabeledInput = ({ label, inputValue, onChange, placeholder }) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">{label}</div>
      <input
        placeholder={placeholder}
        size="30"
        value={inputValue}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
};
