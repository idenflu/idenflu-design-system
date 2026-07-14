import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import nativeSelectStyles from "./NativeSelect.module.css";
import inputSharedStyles from "../_fields/Field.module.css";

export type NativeSelectVariant = "default" | "filled" | "outlined";
export type NativeSelectSize = "lg" | "md" | "sm";

export type NativeSelectOption = {
  disabled?: boolean;
  label: React.ReactNode;
  textValue?: string;
  value: string;
};

export type NativeSelectItemProps = Omit<
  React.OptionHTMLAttributes<HTMLOptionElement>,
  "children" | "label" | "value"
> & {
  children: React.ReactNode;
  textValue?: string;
  value: string;
};

export type NativeSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "defaultValue" | "onChange" | "size" | "value"
> & {
  children?: React.ReactNode;
  defaultValue?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  label?: React.ReactNode;
  onChange?: (
    value: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  onValueChange?: (value: string) => void;
  options?: NativeSelectOption[];
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  size?: NativeSelectSize;
  value?: string;
  variant?: NativeSelectVariant;
};

const getTextValue = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextValue).join(" ");
  return "";
};

const isOptionElement = (
  child: React.ReactNode
): child is React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>> =>
  React.isValidElement<React.OptionHTMLAttributes<HTMLOptionElement>>(child) &&
  child.type === "option";

const collectOptionsFromChildren = (
  children: React.ReactNode,
  options: NativeSelectOption[] = []
) => {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) {
      collectOptionsFromChildren(
        (child.props as { children?: React.ReactNode }).children,
        options
      );
      return;
    }

    if (isOptionElement(child)) {
      const { children: label, disabled, value } = child.props;
      options.push({
        disabled,
        label,
        textValue: getTextValue(label),
        value: String(value ?? getTextValue(label)),
      });
    }
  });

  return options;
};

const nativeSelectClassName = cva(
  [inputSharedStyles.root, nativeSelectStyles.root],
  {
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
        true: [inputSharedStyles.disabled, nativeSelectStyles.disabled],
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
        lg: [inputSharedStyles.sizeLg, nativeSelectStyles.sizeLg],
        md: [inputSharedStyles.sizeMd, nativeSelectStyles.sizeMd],
        sm: [inputSharedStyles.sizeSm, nativeSelectStyles.sizeSm],
      },
      variant: {
        default: inputSharedStyles.variantDefault,
        filled: [
          inputSharedStyles.variantFilled,
          nativeSelectStyles.variantFilled,
        ],
        outlined: inputSharedStyles.variantOutlined,
      },
    },
  }
);

export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      children,
      className,
      defaultValue,
      disabled = false,
      error,
      fullWidth = false,
      helperText,
      id,
      label,
      onChange,
      onValueChange,
      options,
      placeholder,
      readOnly = false,
      required,
      size = "md",
      value,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const helperId = helperText || error ? `${selectId}-helper` : undefined;
    const describedBy =
      [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;
    const hasError = Boolean(error);
    const isFilled = variant === "filled";
    const optionItems = React.useMemo(
      () => options ?? collectOptionsFromChildren(children),
      [children, options]
    );

    const renderedOptions = optionItems.map((option) => (
      <option
        key={option.value}
        disabled={option.disabled}
        value={option.value ?? option.textValue}
      >
        {option.label}
      </option>
    ));

    const control = (
      <>
        <select
          ref={ref}
          id={selectId}
          className={cn(inputSharedStyles.control, nativeSelectStyles.control)}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          aria-label={label ? undefined : ariaLabel}
          aria-readonly={readOnly || undefined}
          defaultValue={value === undefined ? defaultValue : undefined}
          disabled={disabled}
          required={required}
          value={value}
          onChange={(event) => {
            onChange?.(event.target.value, event);
            onValueChange?.(event.target.value);
          }}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          ) : null}
          {options ? renderedOptions : children}
        </select>
        <Icon
          name="keyboard-arrow-down"
          size={16}
          className={nativeSelectStyles.expandIcon}
          aria-hidden="true"
        />
      </>
    );

    return (
      <div
        className={cn(
          nativeSelectClassName({
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
          <label className={inputSharedStyles.label} htmlFor={selectId}>
            <span>{label}</span>
            {required ? (
              <span className={inputSharedStyles.required}>Required*</span>
            ) : null}
          </label>
        ) : null}

        {isFilled ? (
          <label
            className={cn(
              inputSharedStyles.controlWrapper,
              nativeSelectStyles.controlWrapper
            )}
            htmlFor={selectId}
          >
            {label ? (
              <span className={inputSharedStyles.label}>
                <span>{label}</span>
                {required ? (
                  <span className={inputSharedStyles.required}>Required*</span>
                ) : null}
              </span>
            ) : null}
            {control}
          </label>
        ) : (
          <div
            className={cn(
              inputSharedStyles.controlWrapper,
              nativeSelectStyles.controlWrapper
            )}
          >
            {control}
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

NativeSelect.displayName = "NativeSelect";
