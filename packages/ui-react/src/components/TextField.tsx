import * as React from "react";
import { classNames } from "../utils/classNames";

export type FieldState = "default" | "invalid" | "success" | "server-error";
export type FieldAvailability = "editable" | "readonly" | "disabled" | "locked";

export type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> & {
  availability?: FieldAvailability;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  label: string;
  prefix?: React.ReactNode;
  required?: boolean;
  state?: FieldState;
  suffix?: React.ReactNode;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      availability = "editable",
      className,
      disabled,
      error,
      helperText,
      icon,
      id,
      label,
      prefix,
      readOnly,
      required,
      state = "default",
      suffix,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = helperText || error ? `${inputId}-helper` : undefined;
    const describedBy =
      [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;
    const fieldState = error ? "invalid" : state;
    const isDisabled = availability === "disabled";
    const isReadonly = availability === "readonly" || availability === "locked";
    const visualAvailability = disabled
      ? "disabled"
      : readOnly
        ? "readonly"
        : availability;
    const hasShell = Boolean(icon || prefix || suffix);

    const control = (
      <input
        ref={ref}
        id={inputId}
        aria-describedby={describedBy}
        aria-invalid={
          fieldState === "invalid" || fieldState === "server-error" || undefined
        }
        className="if-field__control"
        disabled={isDisabled || disabled}
        readOnly={isReadonly || readOnly}
        required={required}
        {...props}
      />
    );

    return (
      <label
        className={classNames(
          "if-field",
          `if-field--${fieldState}`,
          `if-field--${visualAvailability}`,
          className
        )}
        htmlFor={inputId}
      >
        <span className="if-field__label">
          {label}
          {required ? <em className="if-field__required">Required</em> : null}
        </span>
        {hasShell ? (
          <span
            className={classNames(
              "if-input-shell",
              (isDisabled || disabled) && "is-disabled"
            )}
          >
            {icon ? <span className="if-field__icon">{icon}</span> : null}
            {prefix ? <span className="if-field__prefix">{prefix}</span> : null}
            {control}
            {suffix ? <span className="if-field__suffix">{suffix}</span> : null}
          </span>
        ) : (
          control
        )}
        {helperId ? (
          <small id={helperId} className="if-field__helper">
            {error || helperText}
          </small>
        ) : null}
      </label>
    );
  }
);

TextField.displayName = "TextField";
