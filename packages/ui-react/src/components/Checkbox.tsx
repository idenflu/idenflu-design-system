import * as React from "react";
import { classNames } from "../utils/classNames";

export type CheckboxSize = "small" | "medium";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children"
> & {
  /** Text rendered to the right of the control. Omit only when an `aria-label` is supplied. */
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** Helper text wired via `aria-describedby`. */
  helperText?: React.ReactNode;
  /** Validation error message. Replaces helperText and marks the field invalid. */
  error?: string;
  /** Partial-selection visual + `aria-checked="mixed"`. */
  indeterminate?: boolean;
  /** Control size. Defaults to `"medium"`. */
  size?: CheckboxSize;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      description,
      disabled,
      error,
      helperText,
      id,
      indeterminate = false,
      label,
      size = "medium",
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    const setRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const generatedId = React.useId();
    const controlId = id ?? generatedId;
    const invalid = Boolean(error);
    const helperId = helperText != null || error ? `${controlId}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={classNames("if-checkbox-field", invalid && "is-invalid")}>
        <label className={classNames("if-checkbox", `if-checkbox--${size}`, disabled && "is-disabled", className)}>
          <input
            ref={setRef}
            id={controlId}
            type="checkbox"
            className="if-checkbox__control"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            {...props}
          />
          {label != null ? (
            <span className="if-checkbox__text">
              <span className="if-checkbox__label">{label}</span>
              {description != null ? <span className="if-checkbox__description">{description}</span> : null}
            </span>
          ) : null}
        </label>
        {helperText != null || error ? (
          <p id={helperId} className="if-checkbox__helper">
            {error || helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
