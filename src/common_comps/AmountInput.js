export const AmountInput = ({ value, onChange }) => {
  return (
    <input
      placeholder=""
      type="text"
      size="30"
      id="w-100px"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
