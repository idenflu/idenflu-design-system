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
  value == null || value === "" ? [] : Array.isArray(value) ? value.filter(Boolean) : [value];

export const SelectListbox = React.forwardRef<HTMLDivElement, SelectListboxProps>(
  (
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

    const [activeIndex, setActiveIndex] = React.useState(-1);
    const typeahead = React.useRef<{ buffer: string; timer: number | null }>({ buffer: "", timer: null });

    const [query, setQuery] = React.useState("");
    const searchRef = React.useRef<HTMLInputElement | null>(null);

    const visibleOptions = searchable && query
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;

    const firstEnabled = () => visibleOptions.findIndex((o) => !o.disabled);
    const lastEnabled = () => {
      for (let i = visibleOptions.length - 1; i >= 0; i -= 1) if (!visibleOptions[i].disabled) return i;
      return -1;
    };
    const indexOfValue = (val: string) => visibleOptions.findIndex((o) => o.value === val);

    const openPanel = () => {
      const start = selected.length ? indexOfValue(selected[0]) : firstEnabled();
      setActiveIndex(start >= 0 && !visibleOptions[start]?.disabled ? start : firstEnabled());
      setOpen(true);
    };

    const move = (dir: 1 | -1) => {
      const count = visibleOptions.length;
      if (count === 0) return;
      let next = activeIndex;
      for (let i = 0; i < count; i += 1) {
        next = (next + dir + count) % count;
        if (!visibleOptions[next]?.disabled) break;
      }
      setActiveIndex(next);
    };

    const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (!open) {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPanel();
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        move(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveIndex(firstEnabled());
      } else if (event.key === "End") {
        event.preventDefault();
        setActiveIndex(lastEnabled());
      } else if (event.key === "Enter" || (!searchable && event.key === " ")) {
        event.preventDefault();
        if (visibleOptions[activeIndex]) commit(visibleOptions[activeIndex]);
      } else if (!searchable && event.key.length === 1 && /\S/.test(event.key)) {
        const t = typeahead.current;
        if (t.timer) window.clearTimeout(t.timer);
        t.buffer += event.key.toLowerCase();
        const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(t.buffer));
        if (match >= 0) setActiveIndex(match);
        t.timer = window.setTimeout(() => { t.buffer = ""; }, 600);
      }
    };

    const panelId = `${baseId}-listbox`;
    const optionId = (val: string) => `${baseId}-option-${val.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    const emit = (next: string[]) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(multiple ? next : (next[0] ?? ""));
    };

    const close = (focusTrigger = true) => {
      setOpen(false);
      setQuery("");
      if (focusTrigger) triggerRef.current?.focus();
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
          close(false);
        }
      };
      document.addEventListener("mousedown", onDocMouseDown);
      return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [open]);

    React.useEffect(() => {
      if (open && searchable) searchRef.current?.focus();
    }, [open, searchable]);

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

    const activeDescId = open && visibleOptions[activeIndex] ? optionId(visibleOptions[activeIndex].value) : undefined;

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
          aria-activedescendant={activeDescId}
          onClick={() => { if (disabled) return; if (open) { close(); } else { openPanel(); } }}
          onKeyDown={onTriggerKeyDown}
        >
          <span className="if-select__value">{renderTriggerValue()}</span>
          <span className="if-select__chevron" aria-hidden="true">
            <Icon name="icon-chevron-down" size={16} />
          </span>
        </div>

        {open ? (
          <div ref={panelRef} className="if-select__panel">
            {searchable ? (
              <div className="if-select__search">
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  placeholder="Search"
                  aria-label="Filter options"
                  aria-controls={panelId}
                  aria-activedescendant={activeDescId}
                  autoComplete="off"
                  onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
                  onKeyDown={onTriggerKeyDown}
                />
              </div>
            ) : null}
            <ul id={panelId} role="listbox" aria-labelledby={labelledBy} aria-multiselectable={multiple || undefined} className="if-select__options">
              {visibleOptions.length === 0 ? (
                <li className="if-select__empty" role="presentation">결과 없음</li>
              ) : (
                visibleOptions.map((option, index) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <li
                      key={option.value}
                      id={optionId(option.value)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      className={classNames("if-select__option", isSelected && "is-selected", option.disabled && "is-disabled", index === activeIndex && "is-active")}
                      onClick={() => commit(option)}
                      onMouseEnter={() => { if (!option.disabled) setActiveIndex(index); }}
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
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>
    );
  },
);

SelectListbox.displayName = "SelectListbox";
