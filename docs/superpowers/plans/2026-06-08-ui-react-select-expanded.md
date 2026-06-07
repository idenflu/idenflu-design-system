# Select expanded form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `@idenflu/ui-react` `<Select>` so one component supports both the current native `<select>` form and an opt-in custom **expanded** listbox form with custom options (icon + description), multi-select (chips + checkmarks), and optional search — then mirror it in the docs site.

**Architecture:** Public API stays a single `<Select>`. `Select.tsx` keeps the native `<select>` path unchanged and, when `expanded` is implied (by `multiple`/`searchable`/`icon`/`description` or the explicit `expanded` prop), renders the field chrome around a new internal `<SelectListbox>` widget. `SelectListbox.tsx` owns the trigger button + popup `role="listbox"` panel, keyboard, search, and multi logic, reusing the existing `Chip` and `Icon` components and `--if-*` tokens.

**Tech Stack:** React 18 (source-only, no build), CSS in `packages/ui-react/src/styles.css` with `if-`-prefixed classes and `--if-*` tokens. No bundler/tsc/unit tests — verification is `node scripts/package-skeleton-check.js` (string-marker check), `npm run check`, and visual/keyboard checks in `examples/playground` via Claude Preview.

**Project conventions (must follow):** `React.forwardRef` + `displayName`, `classNames` helper from `../utils/classNames`, `if-` class prefix, `is-` state classes, `--if-*` tokens, accessible names for icon-only controls, never signal state by color alone. No new runtime dependencies.

---

## File Structure

| File | Responsibility |
|---|---|
| `packages/ui-react/src/components/Select.tsx` (modify) | Public `<Select>`. Extend types (`SelectOption.icon/description`, `expanded/multiple/searchable/value/defaultValue/onValueChange`). Compute `isExpanded`; native path unchanged; expanded path renders field chrome + `<SelectListbox>`. |
| `packages/ui-react/src/components/SelectListbox.tsx` (create) | Internal expanded widget: trigger button + listbox panel, single/multi selection, keyboard, optional search. Consumes `Chip`, `Icon`. |
| `packages/ui-react/src/styles.css` (modify) | `.if-select__trigger / __value / __panel / __search / __option / __option-check / __option-icon / __option-text / __empty` rules. |
| `packages/ui-react/src/index.ts` (modify) | Re-export already covers `Select`/`SelectProps`/`SelectOption`; verify new type names resolve. |
| `scripts/package-skeleton-check.js` (modify) | Add markers for `SelectListbox.tsx` + new `if-select__*` CSS + expanded Select.tsx markers. |
| `examples/playground/src/sections/Inputs.tsx` (modify) | Add expanded/multi/searchable/custom-option Select examples. |
| `docs/src/pages/components-select.html` (modify, Phase B) | Document + demo native vs expanded, multiple, searchable, custom options. |
| `docs/script.js` (modify, Phase B) | `data-select-expanded` listbox controller (mirrors existing combobox controller). |
| `docs/component-api.json`, `docs/styles.css` (modify, Phase B) | Select API contract + reuse/extend combobox panel styles. |

---

## Phase A — ui-react component

### Task 1: Extend Select types and route to the expanded path

**Files:**
- Modify: `packages/ui-react/src/components/Select.tsx`

- [ ] **Step 1: Extend `SelectOption` and `SelectProps`, compute `isExpanded`, render field chrome + a temporary inline placeholder for the expanded path.**

Replace the current `SelectOption` type and `SelectProps` type, and the component body, with the following. The native branch is byte-for-byte the existing markup; only the expanded branch and the prop surface are new. (The real expanded UI arrives in Task 2 — here it is a minimal placeholder so the file compiles and the native path is provably unchanged.)

```tsx
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
          {/* Placeholder — replaced by <SelectListbox> in Task 2. */}
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
```

- [ ] **Step 2: Verify the gate and that the native path is unchanged.**

Run: `npm run check`
Expected: `site verification ok` and `package skeleton check ok` (skeleton-check still passes — existing Select markers like `if-field__control--select`, `Select.displayName` remain present).

- [ ] **Step 3: Visually confirm native selects are unchanged in the playground.**

Run: start the `pg` server (Claude Preview `preview_start` name `pg`) and confirm the existing `Inputs` section selects ("Status", etc.) still render as native `<select>` with the chevron and white background. No console errors.

- [ ] **Step 4: Commit.**

```bash
git add packages/ui-react/src/components/Select.tsx
git commit -m "feat(ui-react): Select에 expanded/multiple/searchable props + 타입 확장 (native path 유지)"
```

---

### Task 2: SelectListbox — single-select listbox (trigger + panel) and core CSS

**Files:**
- Create: `packages/ui-react/src/components/SelectListbox.tsx`
- Modify: `packages/ui-react/src/components/Select.tsx` (use the real component)
- Modify: `packages/ui-react/src/styles.css`

- [ ] **Step 1: Create `SelectListbox.tsx` with single-select behavior (click select, open/close, outside-click, a11y roles). Multi/search/keyboard arrive in Tasks 3–5; the props exist now but `multiple`/`searchable` render the simple path.**

```tsx
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

export const SelectListbox = React.forwardRef<HTMLButtonElement, SelectListboxProps>(
  ({ baseId, labelledBy, describedBy, options, placeholder, multiple, searchable, disabled, value, defaultValue, onValueChange }, ref) => {
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);

    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
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
    const optionId = (val: string) => `${baseId}-option-${val}`;

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
          <span className="if-select__tags">
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
        <button
          ref={setTriggerRef}
          type="button"
          className="if-select__trigger"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="if-select__value">{renderTriggerValue()}</span>
          <span className="if-select__chevron" aria-hidden="true">
            <Icon name="icon-chevron-down" size={16} />
          </span>
        </button>

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
```

- [ ] **Step 2: Wire `Select.tsx` to render `<SelectListbox>` instead of the Task 1 placeholder.**

In `packages/ui-react/src/components/Select.tsx`, add the import at the top:

```tsx
import { SelectListbox } from "./SelectListbox";
```

Replace the entire `if (isExpanded) { ... }` block from Task 1 with:

```tsx
    if (isExpanded) {
      const labelId = `${selectId}-label`;
      return (
        <div className={classNames("if-field", `if-field--${state}`, className)}>
          <span className="if-field__label" id={labelId}>
            {label}
            {required ? <em className="if-field__required">Required</em> : null}
          </span>
          <SelectListbox
            baseId={selectId}
            labelledBy={labelId}
            describedBy={describedBy}
            options={options}
            placeholder={placeholder}
            multiple={multiple}
            searchable={searchable}
            disabled={props.disabled}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
          />
          {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
        </div>
      );
    }
```

- [ ] **Step 3: Add core CSS to `packages/ui-react/src/styles.css` (append after the existing `.if-field__control--select` block).**

```css
.if-select {
  position: relative;
}

.if-select__trigger {
  align-items: center;
  background: var(--if-color-surface-raised);
  border: 1px solid var(--if-color-hairline);
  border-radius: var(--if-radius-md);
  color: var(--if-color-ink);
  cursor: pointer;
  display: flex;
  font-family: var(--if-font-family);
  font-size: var(--if-font-size-body-sm);
  gap: var(--if-space-xs);
  justify-content: space-between;
  min-height: var(--if-field-height);
  padding: 6px 11px;
  text-align: left;
  width: 100%;
}

.if-select__trigger:focus-visible {
  border-color: var(--if-color-primary);
  box-shadow: 0 0 0 3px var(--if-focus-ring);
  outline: 0;
}

.if-select__value {
  flex: 1 1 auto;
  min-width: 0;
}

.if-select__placeholder {
  color: var(--if-color-ink-subtle);
}

.if-select__single {
  align-items: center;
  display: inline-flex;
  gap: var(--if-space-xs);
}

.if-select__tags {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--if-space-xxs);
}

.if-select__more {
  color: var(--if-color-ink-muted);
  font-size: var(--if-font-size-caption);
}

.if-select__chevron {
  align-items: center;
  color: var(--if-color-ink-subtle);
  display: inline-flex;
  flex: none;
}

.if-select__panel {
  background: var(--if-color-surface-raised);
  border: 1px solid var(--if-color-hairline);
  border-radius: var(--if-radius-md);
  box-shadow: var(--if-shadow-panel);
  left: 0;
  margin-top: 4px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: var(--if-z-overlay);
}

.if-select__options {
  list-style: none;
  margin: 0;
  max-height: 280px;
  overflow-y: auto;
  padding: var(--if-space-xxs);
}

.if-select__option {
  align-items: center;
  border-radius: var(--if-radius-sm);
  cursor: pointer;
  display: flex;
  gap: var(--if-space-xs);
  padding: 8px 10px;
}

.if-select__option.is-active,
.if-select__option:hover {
  background: var(--if-color-surface-1);
}

.if-select__option.is-disabled {
  color: var(--if-color-ink-subtle);
  cursor: not-allowed;
}

.if-select__option-check {
  align-items: center;
  color: var(--if-color-primary);
  display: inline-flex;
  flex: none;
  height: 16px;
  justify-content: center;
  width: 16px;
}

.if-select__option-icon {
  align-items: center;
  color: var(--if-color-ink-muted);
  display: inline-flex;
  flex: none;
}

.if-select__option-text {
  display: grid;
  min-width: 0;
}

.if-select__option-description {
  color: var(--if-color-ink-muted);
  font-size: var(--if-font-size-caption);
}

.if-select__empty {
  color: var(--if-color-ink-muted);
  font-size: var(--if-font-size-body-sm);
  padding: 12px 10px;
}

.if-select__search {
  border-bottom: 1px solid var(--if-color-hairline);
  padding: var(--if-space-xs);
}

.if-select__search input {
  border: 1px solid var(--if-color-hairline);
  border-radius: var(--if-radius-sm);
  font-family: var(--if-font-family);
  font-size: var(--if-font-size-body-sm);
  padding: 6px 8px;
  width: 100%;
}
```

- [ ] **Step 4: Verify build + render an expanded single-select in the playground.**

Run: `npm run check` → expect `site verification ok` + `package skeleton check ok`.
Then in the `pg` preview, temporarily confirm an expanded Select works (Task 6 adds permanent examples; for now verify via the example you add in Task 6, or a scratch render). Click the trigger → panel opens, options show checkmark when selected, single select closes the panel, outside-click closes it.

- [ ] **Step 5: Commit.**

```bash
git add packages/ui-react/src/components/SelectListbox.tsx packages/ui-react/src/components/Select.tsx packages/ui-react/src/styles.css
git commit -m "feat(ui-react): SelectListbox 단일선택 listbox(트리거+패널) + 스타일"
```

---

### Task 3: SelectListbox — keyboard navigation and active option

**Files:**
- Modify: `packages/ui-react/src/components/SelectListbox.tsx`

- [ ] **Step 1: Add active-option state, `aria-activedescendant`, and a key handler (Arrow/Home/End/Enter/Space/Esc/typeahead). Focus the panel on open; restore to trigger on close.**

Add an `activeIndex` state and a typeahead buffer ref near the other hooks in `SelectListbox`:

```tsx
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const typeahead = React.useRef<{ buffer: string; timer: number | null }>({ buffer: "", timer: null });
    const listRef = React.useRef<HTMLUListElement | null>(null);
```

Replace the `setOpen((o) => !o)` open logic so opening initializes the active option to the first selected (or first enabled) option. Add this helper inside the component:

```tsx
    const firstEnabled = () => options.findIndex((o) => !o.disabled);
    const indexOfValue = (val: string) => options.findIndex((o) => o.value === val);

    const openPanel = () => {
      const start = selected.length ? indexOfValue(selected[0]) : firstEnabled();
      setActiveIndex(start >= 0 ? start : firstEnabled());
      setOpen(true);
    };

    const move = (dir: 1 | -1) => {
      const count = options.length;
      let next = activeIndex;
      for (let i = 0; i < count; i += 1) {
        next = (next + dir + count) % count;
        if (!options[next]?.disabled) break;
      }
      setActiveIndex(next);
    };

    const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
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
        for (let i = options.length - 1; i >= 0; i -= 1) {
          if (!options[i].disabled) { setActiveIndex(i); break; }
        }
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (options[activeIndex]) commit(options[activeIndex]);
      } else if (!searchable && event.key.length === 1 && /\S/.test(event.key)) {
        const t = typeahead.current;
        if (t.timer) window.clearTimeout(t.timer);
        t.buffer += event.key.toLowerCase();
        const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(t.buffer));
        if (match >= 0) setActiveIndex(match);
        t.timer = window.setTimeout(() => { t.buffer = ""; }, 600);
      }
    };
```

- [ ] **Step 2: Wire `onTriggerKeyDown`, `aria-activedescendant`, `onClick={open ? () => setOpen(false) : openPanel}`, and the active class onto the existing JSX.**

On the `<button className="if-select__trigger">`: change `onClick={() => setOpen((o) => !o)}` to `onClick={() => (open ? setOpen(false) : openPanel())}` and add `onKeyDown={onTriggerKeyDown}`.

On the `<ul ... role="listbox">`: add `ref={listRef}` and `aria-activedescendant={open && options[activeIndex] ? optionId(options[activeIndex].value) : undefined}`.

On each `<li ... role="option">`: add `index === activeIndex && "is-active"` into the `classNames(...)` call (compute the index with `options.map((option, index) => ...)`), and `onMouseEnter={() => !option.disabled && setActiveIndex(index)}`.

Keep keyboard focus on the trigger button (the listbox uses `aria-activedescendant`, so the panel is not separately focused). Update the close-on-open effect dependency list to include `activeIndex` only if used; it does not need to.

- [ ] **Step 3: Verify in playground (keyboard).**

Run: `npm run check` (expect both `ok`). In `pg` preview, with an expanded single-select: focus the trigger, press `ArrowDown` to open + move, `Home`/`End`, type a letter to jump (typeahead), `Enter` to select + close, reopen and `Escape` to close. Confirm `aria-activedescendant` updates (inspect) and the active row highlights.

- [ ] **Step 4: Commit.**

```bash
git add packages/ui-react/src/components/SelectListbox.tsx
git commit -m "feat(ui-react): SelectListbox 키보드(화살표/Home/End/Enter/Esc/typeahead) + activedescendant"
```

---

### Task 4: SelectListbox — multi-select polish

**Files:**
- Modify: `packages/ui-react/src/components/SelectListbox.tsx`

Multi toggle, chips, and `+N` were implemented in Task 2 (`commit` toggles and keeps the panel open when `multiple`; `renderTriggerValue` renders chips + `+N`). This task verifies and hardens the multi path.

- [ ] **Step 1: Confirm `commit` keeps the panel open for `multiple` (does NOT call `close()`), and that Enter on an active option toggles without closing.**

Verify in `SelectListbox.tsx` the `commit` function matches Task 2 (multiple branch emits without `close()`). No code change expected; if `close()` is reached for multiple, remove it.

- [ ] **Step 2: Ensure removing the last chip emits an empty array and the trigger shows the placeholder.**

Confirm `emit(selected.filter(...))` on the chip `onRemove` and that `renderTriggerValue` returns the placeholder when `selected.length === 0`. No code change expected.

- [ ] **Step 3: Verify in playground (multi).**

Run: `npm run check` (expect both `ok`). In `pg`, with an expanded `multiple` Select: select 4+ options → trigger shows 3 chips + `+N`; panel stays open with checkmarks; click a chip `x` → that value removed; remove all → placeholder returns. Inspect the panel `<ul>` has `aria-multiselectable="true"`.

- [ ] **Step 4: Commit (only if changes were needed).**

```bash
git add packages/ui-react/src/components/SelectListbox.tsx
git commit -m "fix(ui-react): SelectListbox 다중선택 토글/칩 제거/+N 검증 및 보정"
```

---

### Task 5: SelectListbox — searchable filter

**Files:**
- Modify: `packages/ui-react/src/components/SelectListbox.tsx`

- [ ] **Step 1: Add a `query` state, derive `visibleOptions`, render the search input when `searchable`, and an empty state.**

Add near the other hooks:

```tsx
    const [query, setQuery] = React.useState("");
    const searchRef = React.useRef<HTMLInputElement | null>(null);
```

Derive the filtered list (place above the `return`):

```tsx
    const visibleOptions = searchable && query
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;
```

Focus the search input when the panel opens (add an effect):

```tsx
    React.useEffect(() => {
      if (open && searchable) searchRef.current?.focus();
    }, [open, searchable]);
```

In the panel JSX, before the `<ul>`, add:

```tsx
            {searchable ? (
              <div className="if-select__search">
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  placeholder="Search"
                  aria-label="Filter options"
                  onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
                  onKeyDown={onTriggerKeyDown}
                />
              </div>
            ) : null}
```

- [ ] **Step 2: Render `visibleOptions` instead of `options` in the `<ul>` map, and show the empty state when none match. Make keyboard `move`/typeahead operate over `visibleOptions`.**

Change the `<ul>` body to map `visibleOptions` and append the empty state:

```tsx
              {visibleOptions.length === 0 ? (
                <li className="if-select__empty" role="presentation">결과 없음</li>
              ) : (
                visibleOptions.map((option, index) => (/* the existing <li role="option"> ... using index for is-active */))
              )}
```

Update `move`, `firstEnabled`, `End`, `Enter`-commit, and `aria-activedescendant` to read from `visibleOptions` (not `options`) so navigation matches what is shown. When `searchable`, the typeahead branch in `onTriggerKeyDown` is already skipped (`!searchable`), so the search input drives filtering.

- [ ] **Step 3: Verify in playground (search).**

Run: `npm run check` (expect both `ok`). In `pg`, with a `searchable` expanded Select: open → search input is focused; type to filter; `ArrowDown`/`Enter` selects a filtered option; clearing the query restores the list; a no-match query shows "결과 없음".

- [ ] **Step 4: Commit.**

```bash
git add packages/ui-react/src/components/SelectListbox.tsx
git commit -m "feat(ui-react): SelectListbox searchable 필터 입력 + empty 상태"
```

---

### Task 6: skeleton-check markers, exports, and playground examples

**Files:**
- Modify: `scripts/package-skeleton-check.js`
- Modify: `packages/ui-react/src/index.ts`
- Modify: `examples/playground/src/sections/Inputs.tsx`

- [ ] **Step 1: Add skeleton-check coverage for the new file and CSS.**

In `scripts/package-skeleton-check.js`, add `"packages/ui-react/src/components/SelectListbox.tsx"` to the `requireFile` list, add a `requireIncludes` block for it, and extend the Select markers:

```js
requireIncludes("packages/ui-react/src/components/SelectListbox.tsx", [
  "role=\"listbox\"",
  "aria-multiselectable",
  "aria-activedescendant",
  "if-select__trigger",
  "SelectListbox.displayName",
]);

requireIncludes("packages/ui-react/src/components/Select.tsx", [
  "expanded?: boolean",
  "multiple?: boolean",
  "searchable?: boolean",
  "onValueChange",
  "SelectListbox",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-select__trigger",
  ".if-select__panel",
  ".if-select__option",
]);
```

- [ ] **Step 2: Confirm `index.ts` re-exports resolve.**

`packages/ui-react/src/index.ts` already re-exports `Select`, `SelectProps`, `SelectOption`. No new public component is added (SelectListbox is internal). Verify `SelectOption` now carries `icon`/`description` (it is the same exported type). No code change unless an export is missing.

- [ ] **Step 3: Add expanded examples to the playground Inputs section.**

In `examples/playground/src/sections/Inputs.tsx`, add (within the existing `Section`) a new `Group` showing: an expanded single-select with custom options (icon + description), a `multiple` select, and a `searchable` select. Use existing icons (`icon-user`, `icon-file`, `icon-star`). Example block:

```tsx
      <Group label="Select — expanded / custom options / multi / searchable">
        <Col>
          <Select
            label="Owner (expanded, custom options)"
            expanded
            options={[
              { value: "mina", label: "Mina Park", description: "Campaign owner", icon: <Icon name="icon-user" /> },
              { value: "jiho", label: "Jiho Lee", description: "Reviewer", icon: <Icon name="icon-user" /> },
              { value: "soo", label: "Soo Kim", description: "External", icon: <Icon name="icon-user" /> },
            ]}
            placeholder="Select owner"
            onValueChange={() => {}}
          />
          <Select
            label="Channels (multiple)"
            multiple
            options={[
              { value: "ig", label: "Instagram" },
              { value: "tt", label: "TikTok" },
              { value: "yt", label: "YouTube" },
              { value: "x", label: "X" },
              { value: "fb", label: "Facebook" },
            ]}
            placeholder="Select channels"
            onValueChange={() => {}}
          />
          <Select
            label="Country (searchable)"
            searchable
            options={[
              { value: "kr", label: "Korea" },
              { value: "jp", label: "Japan" },
              { value: "us", label: "United States" },
              { value: "de", label: "Germany" },
              { value: "fr", label: "France" },
            ]}
            placeholder="Select country"
            onValueChange={() => {}}
          />
        </Col>
      </Group>
```

Ensure `Icon` is imported in `Inputs.tsx` (it already is).

- [ ] **Step 4: Full ui-react verification.**

Run: `npm run check` → expect `site verification ok` + `package skeleton check ok`.
In `pg` preview: exercise all three new examples (custom options render icon + description; multi shows chips + checkmarks; searchable filters). Confirm no console errors and native selects elsewhere are unchanged.

- [ ] **Step 5: Commit.**

```bash
git add scripts/package-skeleton-check.js packages/ui-react/src/index.ts examples/playground/src/sections/Inputs.tsx
git commit -m "feat(ui-react): Select expanded skeleton-check 마커 + 플레이그라운드 예시"
```

---

## Phase B — docs mirror

### Task 7: docs Select page demos + expanded listbox controller

**Files:**
- Modify: `docs/script.js`
- Modify: `docs/src/pages/components-select.html`
- Modify: `docs/styles.css`

- [ ] **Step 1: Add a `data-select-expanded` controller to `docs/script.js`, mirroring the existing combobox controller.**

The controller wires: trigger button (`[data-select-trigger]`) toggling `aria-expanded` + showing `[data-select-panel]`; options (`[role="option"]`) toggling `aria-selected` (single closes, multi toggles); chips/`+N` for multi; optional `[data-select-search]` filtering options; keyboard (Arrow/Enter/Esc/typeahead) over visible options; outside-click + Escape close. Mirror the structure of the combobox controller already in `docs/script.js` (search it for `data-combobox`).

- [ ] **Step 2: Add demos to `docs/src/pages/components-select.html`.**

Add a section after the existing native demos documenting and demoing: native vs expanded; expanded with custom options (`<strong>label</strong><small>description</small>`, reusing the combobox option markup); a multi-select demo (chips); a searchable demo. Update the existing `React: <Select ... />` note to mention `expanded`, `multiple`, `searchable`, and `SelectOption.icon/description`. Keep all `verify-site` markers/partials intact (do not remove the page-header, partials, `id="select"`, etc.).

- [ ] **Step 3: Reuse/extend combobox panel styles in `docs/styles.css`.**

The expanded select panel reuses `.combobox-panel`/`role="listbox"` option styling. Add only the deltas needed (e.g. `.select-expanded-trigger`, chip row for multi) that aren't already covered.

- [ ] **Step 4: Rebuild + verify the docs site.**

Run: `node docs/scripts/build-site.js && npm run check`
Expected: `built N pages`, then `site verification ok` + `package skeleton check ok`. Confirm build reproducibility: `node docs/scripts/build-site.js && git status` shows no further diff beyond the committed sources.

- [ ] **Step 5: Visually verify the docs Select page.**

In the `docs` preview (Claude Preview name `docs`, full URL `http://localhost:8080/components-select.html`), exercise the expanded/multi/searchable demos (use the overlay-clone trick for sections below the fold). Confirm the demos behave and match the ui-react component.

- [ ] **Step 6: Commit.**

```bash
git add docs/script.js docs/src/pages/components-select.html docs/components-select.html docs/styles.css
git commit -m "docs: Select native vs expanded · multi · searchable 데모/문서 추가"
```

---

### Task 8: docs Select API metadata

**Files:**
- Modify: `docs/component-api.json`
- Modify: `docs/component-usage.json` (if usage copy changes)

- [ ] **Step 1: Update the `select` entry in `docs/component-api.json` to cover the new capabilities.**

Extend `props`/`states`/`accessibility` to include the expanded form, e.g. props add `expanded`, `multiple`, `searchable`, `icon`, `description`; accessibility add `role=listbox`, `aria-multiselectable`, `aria-activedescendant`. Keep the entry shape (the page's API-contract partial reads it).

- [ ] **Step 2: Rebuild + verify.**

Run: `node docs/scripts/build-site.js && npm run check`
Expected: `built N pages` + `site verification ok` + `package skeleton check ok`. The generated `components-select.html` API contract now lists the new props.

- [ ] **Step 3: Commit.**

```bash
git add docs/component-api.json docs/component-usage.json docs/components-select.html docs/components.html
git commit -m "docs: Select API contract에 expanded/multiple/searchable/custom options 반영"
```

---

## Self-Review

**Spec coverage:**
- Native + expanded forms → Task 1 (routing) + Task 2 (listbox). ✓
- `expanded/multiple/searchable` props, `SelectOption.icon/description`, `onValueChange` → Task 1 types, Task 2/4/5 behavior. ✓
- Multi chips + `+N` + checkmarks → Task 2 render + Task 4 verify. ✓
- Keyboard (↑↓/Home/End/Enter/Esc/typeahead) + activedescendant → Task 3. ✓
- Searchable + empty state → Task 5. ✓
- a11y listbox roles → Task 2 (`role=listbox/option`, `aria-multiselectable`, `aria-selected`) + Task 3 (`aria-activedescendant`). ✓
- File split (Select.tsx + internal SelectListbox.tsx) → Tasks 1–2. ✓
- skeleton-check markers + index exports + playground → Task 6. ✓
- docs mirror (page, controller, api.json) → Tasks 7–8. ✓
- Native backward-compat → Task 1 Step 3 + Task 6 Step 4 visual checks. ✓
- YAGNI (no renderValue/renderOption, no remote, no optgroup) → not present in any task. ✓

**Placeholder scan:** No "TBD/TODO". Task 7 Step 1 describes the docs controller by mirroring the existing combobox controller rather than pasting it — this is intentional (the source controller is in-repo and long); the executor copies its structure. Acceptable.

**Type consistency:** `SelectOption`/`SelectProps`/`SelectListboxProps`/`onValueChange`/`emit`/`commit`/`visibleOptions` names are consistent across Tasks 1–5. `move`/`firstEnabled`/`aria-activedescendant` switch from `options` to `visibleOptions` in Task 5 — Task 5 Step 2 calls this out explicitly so earlier tasks stay correct (single/multi without search use `visibleOptions === options`).
