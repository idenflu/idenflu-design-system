import * as React from "react";
import { classNames } from "../utils/classNames";
import type { FieldState } from "./TextField";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  helperText?: string;
  label: string;
  state?: FieldState;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, id, label, state = error ? "invalid" : "default", ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const helperId = helperText || error ? `${textareaId}-helper` : undefined;

    return (
      <label className={classNames("if-field", `if-field--${state}`, className)} htmlFor={textareaId}>
        <span className="if-field__label">{label}</span>
        <textarea
          ref={ref}
          id={textareaId}
          aria-describedby={helperId}
          aria-invalid={state === "invalid" || undefined}
          className="if-field__control if-field__control--textarea"
          {...props}
        />
        {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
      </label>
    );
  },
);

Textarea.displayName = "Textarea";
