import * as React from "react";
import { classNames } from "../utils/classNames";
import type { FieldState } from "./TextField";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  error?: string;
  helperText?: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  state?: FieldState;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ "aria-describedby": ariaDescribedBy, className, error, helperText, id, label, options, placeholder, required, state = error ? "invalid" : "default", ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const helperId = helperText || error ? `${selectId}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <label className={classNames("if-field", `if-field--${state}`, className)} htmlFor={selectId}>
        <span className="if-field__label">
          {label}
          {required ? <em className="if-field__required">Required</em> : null}
        </span>
        <select
          ref={ref}
          id={selectId}
          aria-describedby={describedBy}
          aria-invalid={state === "invalid" || state === "server-error" || undefined}
          className="if-field__control if-field__control--select"
          required={required}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
      </label>
    );
  },
);

Select.displayName = "Select";
