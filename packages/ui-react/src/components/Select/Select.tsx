import { Select as SelectPrimitive } from "radix-ui";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import inputSharedStyles from "../_fields/Field.module.css";
import styles from "./Select.module.css";

export type SelectVariant = "default" | "filled" | "outlined";
export type SelectSize = "lg" | "md" | "sm";

export type SelectOption = {
  disabled?: boolean;
  label: React.ReactNode;
  textValue?: string;
  value: string;
};

export type SelectItemProps = {
  children: React.ReactNode;
  disabled?: boolean;
  textValue?: string;
  value: string;
};

const getTextValue = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextValue).join(" ");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextValue(node.props.children);
  }
  return "";
};

const rootClassName = cva([inputSharedStyles.root, styles.root], {
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

const contentClassName = cva(styles.content, {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

export const SelectItem = ({
  children,
  disabled,
  textValue,
  value,
}: SelectItemProps) => (
  <SelectPrimitive.Item
    className={styles.item}
    disabled={disabled}
    textValue={textValue ?? getTextValue(children)}
    value={value}
  >
    <SelectPrimitive.ItemText className={styles.itemLabel}>
      {children}
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

SelectItem.displayName = "SelectItem";

export type SelectProps = {
  "aria-describedby"?: string;
  children?: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  label?: React.ReactNode;
  name?: string;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  open?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: SelectSize;
  value?: string;
  variant?: SelectVariant;
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      children,
      className,
      defaultOpen,
      defaultValue,
      disabled = false,
      error,
      fullWidth = false,
      helperText,
      id,
      label,
      name,
      onOpenChange,
      onValueChange,
      open,
      options,
      placeholder = "Select",
      readOnly = false,
      required,
      size = "md",
      value,
      variant = "default",
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
    const menuLocked = disabled || readOnly;

    const items = options
      ? options.map((option) => (
          <SelectItem
            key={option.value}
            disabled={option.disabled}
            textValue={option.textValue ?? getTextValue(option.label)}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))
      : children;

    const handleOpenChange = (nextOpen: boolean) => {
      if (menuLocked && nextOpen) return;
      onOpenChange?.(nextOpen);
    };

    const labelContent = label ? (
      <span className={inputSharedStyles.label}>
        <span>{label}</span>
        {required ? (
          <span className={inputSharedStyles.required}>Required*</span>
        ) : null}
      </span>
    ) : null;

    const trigger = (
      <SelectPrimitive.Trigger
        ref={ref}
        id={selectId}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className={cn(inputSharedStyles.control, styles.trigger)}
        disabled={menuLocked}
      >
        <SelectPrimitive.Value
          className={styles.value}
          placeholder={placeholder}
        />
        <SelectPrimitive.Icon className={styles.chevron} asChild>
          <span>
            <Icon name="keyboard-arrow-down" size={16} aria-hidden="true" />
          </span>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );

    return (
      <SelectPrimitive.Root
        defaultOpen={defaultOpen}
        defaultValue={defaultValue}
        disabled={menuLocked}
        name={name}
        open={open}
        required={required}
        value={value}
        onOpenChange={handleOpenChange}
        onValueChange={onValueChange}
      >
        <div
          className={cn(
            rootClassName({
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
              className={inputSharedStyles.controlWrapper}
              htmlFor={selectId}
            >
              {labelContent}
              {trigger}
            </label>
          ) : (
            <div className={inputSharedStyles.controlWrapper}>{trigger}</div>
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

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            align="start"
            className={contentClassName({ size })}
            data-size={size}
            position="popper"
            side="bottom"
            sideOffset={size === "lg" ? 18 : size === "md" ? 14 : 10}
            alignOffset={-11}
          >
            <SelectPrimitive.Viewport className={styles.viewport}>
              {items}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  }
);

Select.displayName = "Select";
