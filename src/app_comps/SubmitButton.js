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
      <div>
        <svg className="btn-loader">
          <circle
            className="path-btn"
            cx="50"
            cy="50"
            r="16"
            fill="none"
            strokeWidth="5"
            strokeMiterlimit="10"
          ></circle>
        </svg>
      </div>
    </button>
  );
};
