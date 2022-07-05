import React, { useState, useEffect, useMemo, Fragment } from "react";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import { SelectDateModal } from "../create/SelectDateModal";
import info from "../images/svg/info.svg";
import error from "../images/svg/error.svg";
import funds from "../images/funds.svg";
import calendar from "../images/calendar_today.svg";

export const LabeledInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  maxLength,
  img,
  info,
  disabled,
}) => {
  const [inputLength, setInputLength] = useState(0);
  const [showLength, setShowLength] = useState(false);

  const container_class = img ? "input_with_image__container" : "";

  useEffect(() => {
    setInputLength(inputValue?.length);
  }, [inputValue]);

  return (
    <div className="labeled_input">
      <div className="labeled_input__label d-flex align-center w-94 justify-between">
        <div className="d-flex align-center gap-10">
          <div>{label}</div>
          {info && <InfoView info={info} />}
        </div>
        <div>
          {showLength && maxLength && (
            <InputLength length={inputLength} maxLength={maxLength} />
          )}
        </div>
      </div>
      <div className={container_class}>
        {input(
          inputValue,
          "text",
          (input) => {
            setInputLength(input.length);
            onChange(input);
          },
          placeholder,
          (focus) => {
            setShowLength(focus);
          },
          disabled
        )}
        {img && <img src={img} alt="img" />}
      </div>
      <div className="labeled_input__error">
        {errorMsg ? <img src={error} alt="error" /> : ""}
        {errorMsg}
      </div>
    </div>
  );
};

const InfoView = ({ info: infoText }) => {
  return (
    <Fragment>
      <div className="d-flex align-center" data-tip={infoText}>
        <img src={info} alt="info" />
      </div>
      <ReactTooltip />
    </Fragment>
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
  img,
  info,
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">
        {label}
        {info && <InfoView info={info} />}
      </div>
      <div className="input_with_image__container">
        {input(inputValue, "number", onChange, placeholder)}
        <img src={funds} alt="img" />
      </div>
      <ValidationMsg errorMsg={errorMsg} />
    </div>
  );
};

export const LabeledAmountInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  info,
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">
        {label}
        {info && <InfoView info={info} />}
      </div>
      {input(inputValue, "number", onChange, placeholder)}
      <ValidationMsg errorMsg={errorMsg} />
    </div>
  );
};

export const ValidationMsg = ({ errorMsg }) => {
  return (
    <div className="labeled_input__error">
      {errorMsg ? <img src={error} alt="error" /> : ""}
      {errorMsg}
    </div>
  );
};

// onFocusToggle: optional: pass to be called when the input gains or loses focus
const input = (
  inputValue,
  type,
  onChange,
  placeholder,
  onFocusToggle,
  disabled
) => {
  return (
    <input
      className="label-input-style"
      placeholder={placeholder}
      size="30"
      type={type}
      min="0" // only active if type is number
      value={inputValue}
      disabled={disabled}
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
  img,
  className,
  rows = 10,
}) => {
  const [inputLength, setInputLength] = useState(0);
  const [showLength, setShowLength] = useState(false);

  const container_class = img ? "textarea_with_image__container" : "";

  useEffect(() => {
    setInputLength(inputValue.length);
  }, [inputValue]);

  return (
    <div className={`labeled_input ${className}`}>
      <div className="labeled_input__label d-flex align-center w-94 justify-between">
        {label}
        <div>
          {showLength && maxLength && (
            <InputLength length={inputLength} maxLength={maxLength} />
          )}
        </div>
      </div>
      <div className="labeled_input__error">{errorMsg}</div>
      <div className={container_class}>
        <textarea
          rows={rows}
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
        {img && <img src={img} alt="img" />}
      </div>
    </div>
  );
};

export const LabeledDateInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  info,
  disabled,
}) => {
  const [showMinRaiseTargetEndDateModal, setShowMinRaiseTargetEndDateModal] =
    useState(false);

  const formattedMinRaiseTargetEndDate = useMemo(() => {
    return moment(inputValue).format("D MMM YYYY");
  }, [inputValue]);

  return (
    <div className="labeled_input">
      <div className="labeled_input__label">
        {label}
        {info && <InfoView info={info} />}
      </div>
      <div className="date-input__container">
        {input(
          formattedMinRaiseTargetEndDate,
          "text",
          () => {},
          placeholder,
          () => setShowMinRaiseTargetEndDateModal(true),
          disabled
        )}
        <img src={calendar} alt="img" className={disabled && "opacity-50"} />
      </div>
      <ValidationMsg errorMsg={errorMsg} />
      {showMinRaiseTargetEndDateModal && (
        <SelectDateModal
          closeModal={() => setShowMinRaiseTargetEndDateModal(false)}
          endDate={inputValue}
          setEndDate={onChange}
        />
      )}
    </div>
  );
};
