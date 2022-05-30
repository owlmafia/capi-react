import Progress from "../app_comps/Progress";

export const SubmitButton = ({
  label,
  disabled,
  isLoading,
  className,
  onClick,
}) => {
  if (isLoading) {
    return loadingButton(className);
  } else {
    return button(label, disabled, className, onClick);
  }
};

const button = (label, disabled, className, onClick) => {
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={async () => {
        onClick();
      }}
    >
      {label}
    </button>
  );
};

const loadingButton = (className) => {
  return (
    <button className={className}>
      <Progress />
    </button>
  );
};
