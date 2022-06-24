export const AmountInput = ({ value, onChange }) => {
  return (
    <input
      placeholder=""
      type="text"
      size="30"
      id="invest_em_share_count_input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
