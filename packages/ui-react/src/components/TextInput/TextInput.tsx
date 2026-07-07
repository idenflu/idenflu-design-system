import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import inputSharedStyles from "../_fields/Field.module.css";
import textInputStyles from "./TextInput.module.css";

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

const textInputClassName = cva(inputSharedStyles.root, {
  defaultVariants: {
    disabled: false,
    error: false,
    fullWidth: false,
    readOnly: false,
    size: "md",
    variant: "default",
  },
  variants: {
    disabled: {
      false: null,
      true: inputSharedStyles.disabled,
    },
    error: {
      false: null,
      true: inputSharedStyles.error,
    },
    fullWidth: {
      false: null,
      true: inputSharedStyles.fullWidth,
    },
    readOnly: {
      false: null,
      true: inputSharedStyles.readOnly,
    },
    size: {
      lg: inputSharedStyles.sizeLg,
      md: inputSharedStyles.sizeMd,
      sm: inputSharedStyles.sizeSm,
    },
    variant: {
      default: inputSharedStyles.variantDefault,
      filled: inputSharedStyles.variantFilled,
      outlined: inputSharedStyles.variantOutlined,
    },
  },
});

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
      required,
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
        className={inputSharedStyles.control}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        {...props}
      />
    );

    const fieldContent = isPassword ? (
      <div className={textInputStyles.inputRow}>
        {input}
        <button
          type="button"
          className={textInputStyles.toggle}
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

    return (
      <div
        className={cn(
          textInputClassName({
            disabled,
            error: hasError,
            fullWidth,
            readOnly,
            size,
            variant,
          }),
          className
        )}
      >
        {!isFilled && label ? (
          <label className={inputSharedStyles.label} htmlFor={inputId}>
            <span>{label}</span>
            {required ? (
              <span className={inputSharedStyles.required}>Required*</span>
            ) : null}
          </label>
        ) : null}

        {isFilled ? (
          <label className={inputSharedStyles.controlWrapper} htmlFor={inputId}>
            {label ? (
              <span className={inputSharedStyles.label}>
                <span>{label}</span>
                {required ? (
                  <span className={inputSharedStyles.required}>Required*</span>
                ) : null}
              </span>
            ) : null}
            {fieldContent}
          </label>
        ) : (
          <div className={inputSharedStyles.controlWrapper}>{fieldContent}</div>
        )}

        {helperId ? (
          <p
            id={helperId}
            className={cn(
              inputSharedStyles.helper,
              hasError && inputSharedStyles.helperError
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
