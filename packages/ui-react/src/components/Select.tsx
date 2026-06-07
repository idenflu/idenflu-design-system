import * as React from "react";
import { classNames } from "../utils/classNames";
import type { FieldState } from "./TextField";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
  /** Leading icon — rendered only in the expanded form. */
  icon?: React.ReactNode;
  /** Secondary line — rendered only in the expanded form. */
  description?: React.ReactNode;
};

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children" | "value" | "defaultValue"> & {
  error?: string;
  helperText?: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  state?: FieldState;
  /** Use the custom listbox form. Implied true by multiple/searchable/icon/description. */
  expanded?: boolean;
  /** Multi-select (expanded). `value` becomes string[]. */
  multiple?: boolean;
  /** Filter input at the top of the dropdown (expanded). */
  searchable?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  /** Value-change callback for the expanded form (distinct from native onChange). */
  onValueChange?: (value: string | string[]) => void;
};

const optionsNeedExpanded = (options: SelectOption[]) =>
  options.some((option) => option.icon != null || option.description != null);

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      defaultValue,
      error,
      expanded,
      helperText,
      id,
      label,
      multiple = false,
      onValueChange,
      options,
      placeholder,
      required,
      searchable = false,
      state = error ? "invalid" : "default",
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const helperId = helperText || error ? `${selectId}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;

    const isExpanded = Boolean(expanded || multiple || searchable || optionsNeedExpanded(options));

    if (isExpanded) {
      const labelId = `${selectId}-label`;
      return (
        <div className={classNames("if-field", `if-field--${state}`, className)}>
          <span className="if-field__label" id={labelId}>
            {label}
            {required ? <em className="if-field__required">Required</em> : null}
          </span>
          {/* Placeholder — replaced by <SelectListbox> in a later task. */}
          <button type="button" className="if-select__trigger" aria-labelledby={labelId} aria-describedby={describedBy} aria-haspopup="listbox" aria-expanded={false}>
            <span className="if-select__value">{placeholder ?? "Select"}</span>
          </button>
          {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
        </div>
      );
    }

    const singleValue = typeof value === "string" ? value : undefined;
    const singleDefault = typeof defaultValue === "string" ? defaultValue : undefined;

    return (
      <label className={classNames("if-field", `if-field--${state}`, className)} htmlFor={selectId}>
        <span className="if-field__label">
          {label}
          {required ? <em className="if-field__required">Required</em> : null}
        </span>
        <select
          ref={ref}
          id={selectId}
          aria-describedby={describedBy}
          aria-invalid={state === "invalid" || state === "server-error" || undefined}
          className="if-field__control if-field__control--select"
          required={required}
          value={singleValue}
          defaultValue={singleDefault}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
      </label>
    );
  },
);

Select.displayName = "Select";
