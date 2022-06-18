import React, { useState, useEffect } from "react";

import error from "../images/svg/error.svg";

export const LabeledInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  maxLength,
  icon,
  img
}) => {
  const [inputLength, setInputLength] = useState(0);
  const [showLength, setShowLength] = useState(false);

  useEffect(() => {
    setInputLength(inputValue?.length);
  }, [inputValue]);

  return (
    <div className="labeled_input">
      <div className="labeled_input__label d-flex align-center w-94 justify-between">
        <div className="d-flex align-center gap-10">
          <div>{label}</div>
          {icon ? <img src={icon} alt="icon" /> : ""}
        </div>
        <div>
          {showLength && maxLength && (
            <InputLength length={inputLength} maxLength={maxLength} />
          )}
        </div>
      </div>
      {input(
        inputValue,
        (input) => {
          setInputLength(input.length);
          onChange(input);
        },
        placeholder,
        (focus) => {
          setShowLength(focus);
        }
      )}
      <div className="labeled_input__error">
        {errorMsg ? <img src={error} alt="error" /> : ""}
        {errorMsg}
      </div>
    </div>
  );
};

const InputLength = ({ length, maxLength }) => {
  return <div>{maxLength - length}</div>;
};

export const LabeledCurrencyInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  img
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">{label}</div>
      <div className="input_with_currency__container">
        {input(inputValue, onChange, placeholder)}
        <img src={img} alt="img" />
      </div>
      <div className="labeled_input__error">
        {errorMsg ? <img src={error} alt="error" /> : ""}
        {errorMsg}
      </div>
    </div>
  );
};

// onFocusToggle: optional: pass to be called when the input gains or loses focus
const input = (inputValue, onChange, placeholder, onFocusToggle) => {
  return (
    <input
      className="label-input-style"
      placeholder={placeholder}
      size="30"
      value={inputValue}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      onFocus={(e) => {
        if (onFocusToggle) {
          onFocusToggle(true);
        }
      }}
      onBlur={(e) => {
        if (onFocusToggle) {
          onFocusToggle(false);
        }
      }}
    />
  );
};

export const LabeledTextArea = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  maxLength,
}) => {
  const [inputLength, setInputLength] = useState(0);
  const [showLength, setShowLength] = useState(false);

  useEffect(() => {
    setInputLength(inputValue.length);
  }, [inputValue]);

  return (
    <div className="labeled_input">
      <div className="labeled_input__label d-flex align-center w-94 justify-between">
        {label}
        <div>
          {showLength && maxLength && (
            <InputLength length={inputLength} maxLength={maxLength} />
          )}
        </div>
      </div>
      <div className="labeled_input__error">{errorMsg}</div>
      <textarea
        rows="10"
        cols="50"
        value={inputValue}
        placeholder={placeholder}
        onChange={(event) => {
          const input = event.target.value;
          setInputLength(input.length);
          onChange(input);
        }}
        onFocus={(e) => {
          setShowLength(true);
        }}
        onBlur={(e) => {
          setShowLength(false);
        }}
      />
    </div>
  );
};
