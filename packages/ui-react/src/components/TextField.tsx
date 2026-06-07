import * as React from "react";
import { classNames } from "../utils/classNames";

export type FieldState = "default" | "invalid" | "success";

export type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  error?: string;
  helperText?: string;
  label: string;
  state?: FieldState;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, error, helperText, id, label, state = error ? "invalid" : "default", ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = helperText || error ? `${inputId}-helper` : undefined;

    return (
      <label className={classNames("if-field", `if-field--${state}`, className)} htmlFor={inputId}>
        <span className="if-field__label">{label}</span>
        <input ref={ref} id={inputId} aria-describedby={helperId} aria-invalid={state === "invalid" || undefined} className="if-field__control" {...props} />
        {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
      </label>
    );
  },
);

TextField.displayName = "TextField";
