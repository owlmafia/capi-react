export const AmountInput = ({ defaultValue, onChange }) => {
  return (
    <input
      placeholder=""
      size="30"
      id="invest_em_share_count_input"
      value={defaultValue}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
