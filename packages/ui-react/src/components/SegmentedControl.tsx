import * as React from "react";
import { classNames } from "../utils/classNames";

export type SegmentedControlSize = "small" | "medium";

export type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  options: SegmentedOption[];
  /** Required accessible name for the group. */
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SegmentedControlSize;
  disabled?: boolean;
};

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    { className, defaultValue, disabled = false, label, onChange, options, size = "medium", value, ...props },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = isControlled ? value : internal;

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={classNames("if-segmented", `if-segmented--${size}`, disabled && "is-disabled", className)}
        {...props}
      >
        {options.map((option) => {
          const selected = current === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={classNames("if-segmented__option", selected && "is-selected")}
              aria-pressed={selected}
              disabled={disabled || option.disabled}
              onClick={() => select(option.value)}
            >
              {option.icon != null ? (
                <span className="if-segmented__icon" aria-hidden="true">
                  {option.icon}
                </span>
              ) : null}
              <span className="if-segmented__label">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);

SegmentedControl.displayName = "SegmentedControl";
