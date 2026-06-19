import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import styles from "./Select.module.css";

export type SelectVariant = "default" | "filled" | "outlined";
export type SelectSize = "lg" | "md" | "sm";

export type SelectOption = {
  disabled?: boolean;
  label: React.ReactNode;
  textValue?: string;
  value: string;
};

export type SelectItemProps = Omit<
  React.OptionHTMLAttributes<HTMLOptionElement>,
  "children" | "label" | "value"
> & {
  children: React.ReactNode;
  textValue?: string;
  value: string;
};

export type SelectProps = Omit<
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
  options?: SelectOption[];
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  size?: SelectSize;
  value?: string;
  variant?: SelectVariant;
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
  options: SelectOption[] = []
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

const selectClassName = cva(styles.root, {
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

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
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

    return (
      <div
        className={cn(
          selectClassName({
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
        {label ? (
          <label className={styles.label} htmlFor={selectId}>
            {label}
          </label>
        ) : null}

        <div className={styles.controlWrap}>
          <select
            ref={ref}
            id={selectId}
            className={styles.control}
            aria-describedby={describedBy}
            aria-invalid={hasError || undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-readonly={readOnly || undefined}
            defaultValue={value === undefined ? defaultValue : undefined}
            disabled={disabled || readOnly}
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
          <span className={styles.indicator} aria-hidden="true">
            <Icon name="keyboard-arrow-down" size={16} />
          </span>
        </div>

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

Select.displayName = "Select";
