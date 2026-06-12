import * as React from "react";
import { classNames } from "../utils/classNames";

export type SegmentedControlSize = "small" | "medium";

export type SegmentedControlVariant = "boxed" | "quiet";

export type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Hover tooltip — useful when labels are visually hidden (icon-only). */
  title?: string;
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
  /** "boxed" draws the bordered track; "quiet" only marks the selected option. */
  variant?: SegmentedControlVariant;
  disabled?: boolean;
};

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    { className, defaultValue, disabled = false, label, onChange, options, size = "medium", value, variant = "boxed", ...props },
    ref,
  ) => {
    const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const current = isControlled ? value : internal;

    const isDisabled = (index: number) => disabled || Boolean(options[index]?.disabled);

    // Roving tabindex: only one option is a Tab stop; arrows move between the rest.
    const selectedIndex = options.findIndex((option) => option.value === current);
    const firstEnabledIndex = options.findIndex((_, index) => !isDisabled(index));
    const activeIndex = selectedIndex >= 0 && !isDisabled(selectedIndex) ? selectedIndex : firstEnabledIndex;

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const activate = (index: number) => {
      const option = options[index];
      if (!option || isDisabled(index)) return;
      select(option.value);
      optionRefs.current[index]?.focus();
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const count = options.length;
      const step = (dir: 1 | -1) => {
        for (let i = 1; i <= count; i += 1) {
          const next = ((index + dir * i) % count + count) % count;
          if (!isDisabled(next)) return next;
        }
        return index;
      };
      let target: number | null = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") target = step(1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = step(-1);
      else if (event.key === "Home") target = options.findIndex((_, i) => !isDisabled(i));
      else if (event.key === "End") {
        for (let i = count - 1; i >= 0; i -= 1) {
          if (!isDisabled(i)) {
            target = i;
            break;
          }
        }
      }
      if (target !== null && target >= 0) {
        event.preventDefault();
        activate(target);
      }
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={classNames("if-segmented", `if-segmented--${size}`, `if-segmented--${variant}`, disabled && "is-disabled", className)}
        {...props}
      >
        {options.map((option, index) => {
          const selected = current === option.value;
          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              className={classNames("if-segmented__option", selected && "is-selected")}
              title={option.title}
              aria-pressed={selected}
              tabIndex={index === activeIndex ? 0 : -1}
              disabled={disabled || option.disabled}
              onClick={() => select(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
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
