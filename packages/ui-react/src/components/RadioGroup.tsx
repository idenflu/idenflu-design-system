import * as React from "react";
import { classNames } from "../utils/classNames";

export type RadioGroupSize = "small" | "medium";

export type RadioOption = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps = Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "onChange" | "defaultValue"
> & {
  options: RadioOption[];
  /** Group label rendered as the `<legend>`. */
  label: React.ReactNode;
  /** Selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Shared input `name`. Defaults to a generated id. */
  name?: string;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  size?: RadioGroupSize;
  orientation?: "vertical" | "horizontal";
};

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      defaultValue,
      description,
      disabled,
      helperText,
      label,
      name,
      onChange,
      options,
      orientation = "vertical",
      size = "medium",
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const groupName = name ?? generatedId;
    const helperId = helperText != null ? `${groupName}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = isControlled ? value : internal;

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    return (
      <fieldset
        ref={ref}
        aria-describedby={describedBy}
        className={classNames(
          "if-radio-group",
          `if-radio-group--${orientation}`,
          `if-radio-group--${size}`,
          disabled && "is-disabled",
          className,
        )}
        disabled={disabled}
        {...props}
      >
        <legend className="if-radio-group__label">{label}</legend>
        {description != null ? <p className="if-radio-group__description">{description}</p> : null}
        <div className="if-radio-group__options">
          {options.map((option) => (
            <label
              key={option.value}
              className={classNames("if-radio", (disabled || option.disabled) && "is-disabled")}
            >
              <input
                type="radio"
                className="if-radio__control"
                name={groupName}
                value={option.value}
                checked={current === option.value}
                disabled={disabled || option.disabled}
                onChange={() => select(option.value)}
              />
              <span className="if-radio__text">
                <span className="if-radio__label">{option.label}</span>
                {option.description != null ? (
                  <span className="if-radio__description">{option.description}</span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
        {helperText != null ? (
          <p id={helperId} className="if-radio-group__helper">
            {helperText}
          </p>
        ) : null}
      </fieldset>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
