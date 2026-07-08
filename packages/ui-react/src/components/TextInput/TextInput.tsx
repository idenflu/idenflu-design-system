import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import inputSharedStyles from "../_fields/Field.module.css";
import textInputStyles from "./TextInput.module.css";
import { IconButton } from "../IconButton/IconButton";

export type TextInputType = "text" | "password" | "email";
export type TextInputVariant = "default" | "filled" | "outlined";
export type TextInputSize = "lg" | "md" | "sm";

export type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  clearable?: boolean;
  controlRef?: React.Ref<HTMLElement>;
  endAdornment?: React.ReactNode;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  label?: React.ReactNode;
  onClear?: () => void;
  size?: TextInputSize;
  startAdornment?: React.ReactNode;
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
      clearable = false,
      controlRef,
      defaultValue,
      disabled,
      endAdornment,
      error,
      fullWidth = false,
      helperText,
      id,
      label,
      onChange,
      onClear,
      readOnly,
      required,
      size = "md",
      startAdornment,
      type = "text",
      value,
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
    const isControlled = value !== undefined;
    const tracksUncontrolledValue = clearable && !isControlled;
    const [showPassword, setShowPassword] = React.useState(false);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? ""
    );
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const assignControlRef = React.useCallback(
      (node: HTMLDivElement | HTMLLabelElement | null) => {
        if (!controlRef) return;
        if (typeof controlRef === "function") {
          controlRef(node);
          return;
        }
        (controlRef as React.MutableRefObject<HTMLElement | null>).current =
          node;
      },
      [controlRef]
    );

    React.useEffect(() => {
      setShowPassword(false);
    }, [type]);

    const currentValue = isControlled
      ? value
      : tracksUncontrolledValue
        ? uncontrolledValue
        : inputRef.current?.value;
    const hasValue = String(currentValue ?? "").length > 0;
    const reservesClearSlot = clearable && !disabled && !readOnly;
    const showClearButton = reservesClearSlot && hasValue;
    const hasAdornments =
      Boolean(startAdornment) ||
      Boolean(endAdornment) ||
      reservesClearSlot ||
      isPassword;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (tracksUncontrolledValue) {
        setUncontrolledValue(event.target.value);
      }
      onChange?.(event);
    };

    const handleClear = () => {
      if (disabled || readOnly || !hasValue) return;

      onClear?.();

      const input = inputRef.current;
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(input, "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }

      if (tracksUncontrolledValue) {
        setUncontrolledValue("");
      }
    };

    const input = (
      <input
        ref={inputRef}
        id={inputId}
        type={isPassword && showPassword ? "text" : type}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className={inputSharedStyles.control}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        value={tracksUncontrolledValue ? uncontrolledValue : value}
        defaultValue={
          tracksUncontrolledValue || isControlled ? undefined : defaultValue
        }
        onChange={clearable ? handleChange : onChange}
        {...props}
      />
    );

    const adornmentClassName = cn(
      textInputStyles.adornment,
      disabled && textInputStyles.adornmentDisabled
    );

    const fieldContent = hasAdornments ? (
      <div className={textInputStyles.inputRow}>
        {startAdornment ? (
          <span className={adornmentClassName}>{startAdornment}</span>
        ) : null}
        {input}
        {endAdornment || reservesClearSlot || isPassword ? (
          <span className={adornmentClassName}>
            {reservesClearSlot ? (
              <IconButton
                label="Clear value"
                disabled={disabled}
                variant="ghost"
                size="xs"
                color="neutral"
                icon={<Icon name="close" aria-hidden="true" />}
                onClick={handleClear}
                tabIndex={showClearButton ? undefined : -1}
                aria-hidden={showClearButton ? undefined : true}
                className={cn(
                  textInputStyles.actionButton,
                  !showClearButton && textInputStyles.actionButtonHidden
                )}
              />
            ) : null}
            {endAdornment}
            {isPassword ? (
              <IconButton
                label={showPassword ? "Hide password" : "Show password"}
                disabled={disabled}
                variant="ghost"
                size="xs"
                color="neutral"
                icon={
                  <Icon
                    name={showPassword ? "visibility-off" : "visibility"}
                    aria-hidden="true"
                  />
                }
                onClick={() => setShowPassword((visible) => !visible)}
                className={textInputStyles.actionButton}
              />
            ) : null}
          </span>
        ) : null}
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
          <label
            ref={assignControlRef}
            className={inputSharedStyles.controlWrapper}
            htmlFor={inputId}
          >
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
          <div
            ref={assignControlRef}
            className={inputSharedStyles.controlWrapper}
          >
            {fieldContent}
          </div>
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
