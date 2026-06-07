import * as React from "react";
import { classNames } from "../utils/classNames";
import type { FieldState } from "./TextField";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  helperText?: string;
  label: string;
  required?: boolean;
  state?: FieldState;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ "aria-describedby": ariaDescribedBy, className, error, helperText, id, label, required, state = "default", ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const helperId = helperText || error ? `${textareaId}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;
    // error always wins over an explicitly-passed state (matches TextField).
    const fieldState = error ? "invalid" : state;

    return (
      <label className={classNames("if-field", `if-field--${fieldState}`, className)} htmlFor={textareaId}>
        <span className="if-field__label">
          {label}
          {required ? <em className="if-field__required">Required</em> : null}
        </span>
        <textarea
          ref={ref}
          id={textareaId}
          aria-describedby={describedBy}
          aria-invalid={fieldState === "invalid" || fieldState === "server-error" || undefined}
          className="if-field__control if-field__control--textarea"
          required={required}
          {...props}
        />
        {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
      </label>
    );
  },
);

Textarea.displayName = "Textarea";
