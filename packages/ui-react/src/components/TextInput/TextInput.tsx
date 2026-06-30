import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import styles from "./TextInput.module.css";

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

const textInputClassName = cva(styles.root, {
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
      true: styles.disabled,
    },
    error: {
      false: null,
      true: styles.error,
    },
    fullWidth: {
      false: null,
      true: styles.fullWidth,
    },
    readOnly: {
      false: null,
      true: styles.readOnly,
    },
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
    variant: {
      default: styles.variantDefault,
      filled: styles.variantFilled,
      outlined: styles.variantOutlined,
    },
  },
});

const controlClassName = cva(styles.control, {
  defaultVariants: {
    filled: false,
  },
  variants: {
    filled: {
      false: null,
      true: styles.controlFilled,
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
        className={styles.input}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        {...props}
      />
    );

    const fieldContent = isPassword ? (
      <div className={styles.inputRow}>
        {input}
        <button
          type="button"
          className={styles.toggle}
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
          <label className={styles.label} htmlFor={inputId}>
            <span>{label}</span>
            {required ? (
              <span className={styles.required}>Required*</span>
            ) : null}
          </label>
        ) : null}

        {isFilled ? (
          <label
            className={controlClassName({ filled: isFilled })}
            htmlFor={inputId}
          >
            {label ? (
              <span className={styles.label}>
                <span>{label}</span>
                {required ? (
                  <span className={styles.required}>Required*</span>
                ) : null}
              </span>
            ) : null}
            {fieldContent}
          </label>
        ) : (
          <div className={controlClassName({ filled: isFilled })}>
            {fieldContent}
          </div>
        )}

        {helperId ? (
          <p
            id={helperId}
            className={cn(styles.helper, hasError && styles.helperError)}
          >
            {error || helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
