import React, { useState, useEffect } from "react";

import funds from "../images/funds.svg";

export const LabeledInput = ({
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
    setInputLength(inputValue?.length);
  }, [inputValue]);

  return (
    <div className="labeled_input">
      <div className="labeled_input__label">{label}</div>
      <div className="labeled_input__error">{errorMsg}</div>
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
      {showLength && maxLength && (
        <InputLength length={inputLength} maxLength={maxLength} />
      )}
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
        onFocusToggle(true);
      }}
      onBlur={(e) => {
        onFocusToggle(false);
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
      <div className="labeled_input__label">{label}</div>
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
      {showLength && maxLength && (
        <InputLength length={inputLength} maxLength={maxLength} />
      )}
    </div>
  );
};
