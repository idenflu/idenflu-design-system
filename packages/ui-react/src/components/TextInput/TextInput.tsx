import * as React from "react";
import { Icon } from "../Icon/Icon";
import { classNames } from "../../utils/classNames";
import "./TextInput.css";

export type TextInputType = "text" | "password" | "email";
export type TextInputVariant = "default" | "filled" | "outlined";
export type TextInputSize = "lg" | "md" | "sm";

export type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  label?: string;
  size?: TextInputSize;
  type?: TextInputType;
  variant?: TextInputVariant;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      disabled,
      error,
      fullWidth = false,
      helperText,
      id,
      label,
      readOnly,
      size = "md",
      type = "text",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = helperText || error ? `${inputId}-helper` : undefined;
    const describedBy =
      [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;
    const hasError = Boolean(error);
    const isFilled = variant === "filled";
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = React.useState(false);

    React.useEffect(() => {
      setShowPassword(false);
    }, [type]);

    const input = (
      <input
        ref={ref}
        id={inputId}
        type={isPassword && showPassword ? "text" : type}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className="nova-text-input__input"
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
    );

    const fieldContent = isPassword ? (
      <div className="nova-text-input__input-row">
        {input}
        <button
          type="button"
          className="nova-text-input__toggle"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          disabled={disabled}
          onClick={() => setShowPassword((visible) => !visible)}
        >
          <Icon
            name={showPassword ? "visibility-off" : "visibility"}
            size="medium"
          />
        </button>
      </div>
    ) : (
      input
    );

    const controlClassName = classNames(
      "nova-text-input__control",
      isFilled && "nova-text-input__control--filled"
    );

    return (
      <div
        className={classNames(
          "nova-text-input",
          `nova-text-input--${variant}`,
          `nova-text-input--${size}`,
          fullWidth && "nova-text-input--full-width",
          hasError && "nova-text-input--error",
          disabled && "nova-text-input--disabled",
          readOnly && "nova-text-input--readonly",
          className
        )}
      >
        {!isFilled && label ? (
          <label className="nova-text-input__label" htmlFor={inputId}>
            {label}
          </label>
        ) : null}

        {isFilled ? (
          <label className={controlClassName} htmlFor={inputId}>
            {label ? (
              <span className="nova-text-input__label">{label}</span>
            ) : null}
            {fieldContent}
          </label>
        ) : (
          <div className={controlClassName}>{fieldContent}</div>
        )}

        {helperId ? (
          <p
            id={helperId}
            className={classNames(
              "nova-text-input__helper",
              hasError && "nova-text-input__helper--error"
            )}
          >
            {error || helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
