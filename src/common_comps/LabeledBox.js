export const LabeledBox = ({ label, children }) => {
  return (
    <div class="labeled_box">
      <div class="labeled_box_label">{label}</div>
      {children}
    </div>
  );
};
