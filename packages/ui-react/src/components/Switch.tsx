import * as React from "react";
import { classNames } from "../utils/classNames";

export type SwitchSize = "small" | "medium";

export type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children"
> & {
  /** Visible label rendered beside the control. Omit only when an `aria-label` is supplied (e.g. a table cell). */
  label?: React.ReactNode;
  /** Secondary line shown under the label. */
  description?: React.ReactNode;
  /** Helper text wired to the input via `aria-describedby`. */
  helperText?: React.ReactNode;
  /** Control size. Defaults to `"medium"`. */
  size?: SwitchSize;
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      description,
      disabled,
      helperText,
      id,
      label,
      size = "medium",
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const controlId = id ?? generatedId;
    const helperId = helperText != null ? `${controlId}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="if-switch-field">
        <label className={classNames("if-switch", `if-switch--${size}`, disabled && "is-disabled", className)}>
          {label != null ? (
            <span className="if-switch__text">
              <span className="if-switch__label">{label}</span>
              {description != null ? <span className="if-switch__description">{description}</span> : null}
            </span>
          ) : null}
          <input
            ref={ref}
            id={controlId}
            type="checkbox"
            role="switch"
            className="if-switch__control"
            aria-describedby={describedBy}
            disabled={disabled}
            {...props}
          />
        </label>
        {helperText != null ? (
          <p id={helperId} className="if-switch__helper">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Switch.displayName = "Switch";
