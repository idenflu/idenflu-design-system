import * as React from "react";
import { classNames } from "../utils/classNames";
import { Chip } from "./Chip";
import { Icon } from "./Icon";
import type { SelectOption } from "./Select";

export type SelectListboxProps = {
  baseId: string;
  labelledBy: string;
  describedBy?: string;
  options: SelectOption[];
  placeholder?: string;
  multiple: boolean;
  searchable: boolean;
  disabled?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

const toArray = (value: string | string[] | undefined): string[] =>
  value == null ? [] : Array.isArray(value) ? value : [value];

export const SelectListbox = React.forwardRef<HTMLDivElement, SelectListboxProps>(
  (
    // searchable: consumed by the search task
    { baseId, labelledBy, describedBy, options, placeholder, multiple, searchable, disabled, value, defaultValue, onValueChange },
    ref,
  ) => {
    const triggerRef = React.useRef<HTMLDivElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);

    const setTriggerRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string[]>(() => toArray(defaultValue));
    const selected = isControlled ? toArray(value) : internal;

    const [open, setOpen] = React.useState(false);

    const panelId = `${baseId}-listbox`;
    const optionId = (val: string) => `${baseId}-option-${val.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    const emit = (next: string[]) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(multiple ? next : (next[0] ?? ""));
    };

    const close = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };

    const commit = (option: SelectOption) => {
      if (option.disabled) return;
      if (multiple) {
        const next = selected.includes(option.value)
          ? selected.filter((v) => v !== option.value)
          : [...selected, option.value];
        emit(next);
      } else {
        emit([option.value]);
        close();
      }
    };

    React.useEffect(() => {
      if (!open) return;
      const onDocMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onDocMouseDown);
      return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [open]);

    const selectedOptions = options.filter((option) => selected.includes(option.value));

    const renderTriggerValue = () => {
      if (selected.length === 0) return <span className="if-select__placeholder">{placeholder ?? "Select"}</span>;
      if (multiple) {
        const max = 3;
        const shown = selectedOptions.slice(0, max);
        const extra = selectedOptions.length - shown.length;
        return (
          <span className="if-select__tags" onClick={(e) => e.stopPropagation()}>
            {shown.map((option) => (
              <Chip
                key={option.value}
                tone="blue"
                onRemove={() => emit(selected.filter((v) => v !== option.value))}
                removeLabel={`Remove ${option.label}`}
              >
                {option.label}
              </Chip>
            ))}
            {extra > 0 ? <span className="if-select__more">+{extra}</span> : null}
          </span>
        );
      }
      const only = selectedOptions[0];
      return (
        <span className="if-select__single">
          {only?.icon != null ? <span className="if-select__option-icon" aria-hidden="true">{only.icon}</span> : null}
          {only?.label}
        </span>
      );
    };

    return (
      <div className={classNames("if-select", multiple && "if-select--multiple")}>
        <div
          ref={setTriggerRef}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          className={classNames("if-select__trigger", disabled && "is-disabled")}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-disabled={disabled || undefined}
          onClick={() => { if (!disabled) setOpen((o) => !o); }}
        >
          <span className="if-select__value">{renderTriggerValue()}</span>
          <span className="if-select__chevron" aria-hidden="true">
            <Icon name="icon-chevron-down" size={16} />
          </span>
        </div>

        {open ? (
          <div ref={panelRef} className="if-select__panel">
            <ul id={panelId} role="listbox" aria-labelledby={labelledBy} aria-multiselectable={multiple || undefined} className="if-select__options">
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <li
                    key={option.value}
                    id={optionId(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    className={classNames("if-select__option", isSelected && "is-selected", option.disabled && "is-disabled")}
                    onClick={() => commit(option)}
                  >
                    <span className="if-select__option-check" aria-hidden="true">
                      {isSelected ? <Icon name="icon-check" size={16} /> : null}
                    </span>
                    {option.icon != null ? <span className="if-select__option-icon" aria-hidden="true">{option.icon}</span> : null}
                    <span className="if-select__option-text">
                      <span className="if-select__option-label">{option.label}</span>
                      {option.description != null ? <span className="if-select__option-description">{option.description}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    );
  },
);

SelectListbox.displayName = "SelectListbox";
