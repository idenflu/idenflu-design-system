# DatePicker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal custom-calendar `<DatePicker>` to `@idenflu/ui-react` supporting single-date and from-to range selection, then mirror it in the docs site.

**Architecture:** One public `<DatePicker>` component (field chrome + trigger button + `role="dialog"` popover containing an inline month grid) with a `range?` prop. Pure date math lives in `utils/dateUtils.ts`. Trigger/popover/outside-click/focus patterns mirror the existing `SelectListbox`. Native `<input type="date">` is intentionally NOT used (custom grid for theming + range highlight).

**Tech Stack:** React 18 (source-only, no build/tsc/tests). CSS in `packages/ui-react/src/styles.css` (`if-` prefix, `--if-*` tokens). Verification: `node scripts/package-skeleton-check.js` (string markers), `npm run check`, and visual/keyboard checks in `examples/playground` + the docs site via Claude Preview. `new Date()` is fine here (it is only banned inside Workflow-tool scripts, not in app code).

**Conventions:** `React.forwardRef` + `displayName`, `classNames` from `../utils/classNames`, `if-`/`is-` classes, `--if-*` tokens, accessible names, no color-only state, no new deps.

---

## File Structure

| File | Responsibility |
|---|---|
| `packages/ui-react/src/utils/dateUtils.ts` (create) | Pure date helpers: pad/format/parse ISO, addDays/addMonths, buildMonthGrid, isWithin (min/max), labels. No React. |
| `packages/ui-react/src/components/DatePicker.tsx` (create) | Public `<DatePicker>`: field chrome + trigger + popover + inline month grid + single/range selection state + keyboard. |
| `packages/ui-react/src/styles.css` (modify) | `.if-datepicker__*` + `.if-datecal__*` rules. |
| `packages/ui-react/src/index.ts` (modify) | Export `DatePicker`, `DatePickerProps`, `DateRange`. |
| `scripts/package-skeleton-check.js` (modify) | Markers for DatePicker file + CSS. |
| `examples/playground/src/sections/Inputs.tsx` (modify) | Single + range DatePicker examples. |
| `docs/script.js`, `docs/src/pages/components-date-time.html`, `docs/styles.css`, `docs/component-api.json` (modify, Phase B) | docs mirror: `[data-datepicker]` controller + demos + API. |

---

## Phase A — ui-react component

### Task 1: dateUtils.ts (pure helpers)

**Files:** Create `packages/ui-react/src/utils/dateUtils.ts`

- [ ] **Step 1: Create the file with exactly this content.**

```ts
export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Indexed by Date.getDay() (0 = Sunday).
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Date -> "YYYY-MM-DD" (local). */
export const toISO = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** "YYYY-MM-DD" -> Date (local midnight) or null. */
export const parseISO = (iso: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!m) return null;
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(date.getTime()) ? null : date;
};

export const addDays = (date: Date, n: number): Date => {
  const x = new Date(date);
  x.setDate(x.getDate() + n);
  return x;
};

/** First day of the month `n` months from `date`. */
export const addMonths = (date: Date, n: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + n, 1);

/** 42 dates (6 weeks) covering the month, leading days from `weekStartsOn`. */
export const buildMonthGrid = (year: number, month: number, weekStartsOn: 0 | 1): Date[] => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

/** Weekday short labels rotated to `weekStartsOn`. */
export const weekdayLabels = (weekStartsOn: 0 | 1): string[] =>
  Array.from({ length: 7 }, (_, i) => WEEKDAY_LABELS[(weekStartsOn + i) % 7]);

/** ISO date strings compare lexically == chronologically. */
export const isWithin = (iso: string, min?: string, max?: string): boolean =>
  (!min || iso >= min) && (!max || iso <= max);
```

- [ ] **Step 2: Verify the gate.** Run: `npm run check` → expect `site verification ok` + `package skeleton check ok` (the new file doesn't break anything; markers come in Task 5).

- [ ] **Step 3: Commit.**

```bash
git add packages/ui-react/src/utils/dateUtils.ts
git commit -m "feat(ui-react): dateUtils 순수 헬퍼(ISO/grid/bounds)"
```

---

### Task 2: DatePicker.tsx — single + range selection, trigger + month grid popover, CSS

**Files:** Create `packages/ui-react/src/components/DatePicker.tsx`; modify `packages/ui-react/src/styles.css`

- [ ] **Step 1: Create `DatePicker.tsx` with this content (functional single AND range selection + display; keyboard and in-range highlight arrive in Tasks 3–4).**

```tsx
import * as React from "react";
import { classNames } from "../utils/classNames";
import { Icon } from "./Icon";
import type { FieldState } from "./TextField";
import { MONTH_LABELS, addDays, addMonths, buildMonthGrid, isWithin, parseISO, toISO, weekdayLabels } from "../utils/dateUtils";

export type DateRange = { from: string; to: string };

export type DatePickerProps = {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  state?: FieldState;
  disabled?: boolean;
  /** from-to range selection. */
  range?: boolean;
  /** Selected value. single = ISO string, range = DateRange. */
  value?: string | DateRange;
  defaultValue?: string | DateRange;
  /** Fires when a selection completes (range: when the end is chosen). */
  onChange?: (value: string | DateRange) => void;
  /** Selectable bounds (ISO "YYYY-MM-DD"). */
  min?: string;
  max?: string;
  /** Week start: 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  placeholder?: string;
  id?: string;
  className?: string;
};

const EMPTY_RANGE: DateRange = { from: "", to: "" };
const asRange = (v: string | DateRange | undefined): DateRange =>
  v == null || typeof v === "string" ? EMPTY_RANGE : v;

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      label, helperText, error, required, state = error ? "invalid" : "default", disabled,
      range = false, value, defaultValue, onChange, min, max, weekStartsOn = 0,
      placeholder, id, className,
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const baseId = id ?? generatedId;
    const labelId = `${baseId}-label`;
    const helperId = helperText || error ? `${baseId}-helper` : undefined;

    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string | DateRange>(defaultValue ?? (range ? EMPTY_RANGE : ""));
    const selected = isControlled ? (value as string | DateRange) : internal;
    const single = typeof selected === "string" ? selected : "";
    const rangeVal = asRange(selected);

    const [open, setOpen] = React.useState(false);
    const [pendingStart, setPendingStart] = React.useState("");
    const [hoverISO, setHoverISO] = React.useState("");

    const todayISO = toISO(new Date());
    const anchorISO = range ? rangeVal.from || todayISO : single || todayISO;
    const anchor = parseISO(anchorISO) ?? new Date();
    const [view, setView] = React.useState({ year: anchor.getFullYear(), month: anchor.getMonth() });
    const [focusISO, setFocusISO] = React.useState(anchorISO);
    const dayRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

    const close = () => {
      setOpen(false);
      setPendingStart("");
      setHoverISO("");
      triggerRef.current?.focus();
    };

    const emit = (next: string | DateRange) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const selectDay = (iso: string) => {
      if (!isWithin(iso, min, max)) return;
      if (!range) {
        emit(iso);
        close();
        return;
      }
      if (!pendingStart) {
        setPendingStart(iso);
        setHoverISO("");
        return;
      }
      if (iso >= pendingStart) {
        emit({ from: pendingStart, to: iso });
        close();
      } else {
        setPendingStart(iso);
      }
    };

    React.useEffect(() => {
      if (!open) return;
      const onDoc = (event: MouseEvent) => {
        const t = event.target as Node;
        if (!popoverRef.current?.contains(t) && !triggerRef.current?.contains(t)) {
          setOpen(false);
          setPendingStart("");
          setHoverISO("");
        }
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    const display = (): string | null => {
      if (range) {
        if (pendingStart) return pendingStart;
        if (rangeVal.from && rangeVal.to) return `${rangeVal.from} ~ ${rangeVal.to}`;
        return null;
      }
      return single || null;
    };
    const shown = display();

    const goMonth = (delta: number) => {
      const d = addMonths(new Date(view.year, view.month, 1), delta);
      setView({ year: d.getFullYear(), month: d.getMonth() });
    };

    const isEndpoint = (iso: string): boolean =>
      range ? iso === rangeVal.from || iso === rangeVal.to || iso === pendingStart : iso === single;

    const days = buildMonthGrid(view.year, view.month, weekStartsOn);
    const monthLabel = `${MONTH_LABELS[view.month]} ${view.year}`;

    return (
      <div className={classNames("if-field", `if-field--${state}`, className)}>
        <span className="if-field__label" id={labelId}>
          {label}
          {required ? <em className="if-field__required">Required</em> : null}
        </span>
        <div className="if-datepicker">
          <button
            ref={setTriggerRef}
            type="button"
            className="if-datepicker__trigger"
            aria-labelledby={labelId}
            aria-describedby={helperId}
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={() => { if (!disabled) setOpen((o) => !o); }}
          >
            <span className={classNames("if-datepicker__value", !shown && "is-placeholder")}>
              {shown ?? placeholder ?? (range ? "Select range" : "Select date")}
            </span>
            <span className="if-datepicker__icon" aria-hidden="true">
              <Icon name="icon-calendar" size={16} />
            </span>
          </button>

          {open ? (
            <div ref={popoverRef} role="dialog" aria-label={label} className="if-datepicker__popover">
              <div className="if-datecal__header">
                <button type="button" className="if-datecal__nav" aria-label="Previous month" onClick={() => goMonth(-1)}>
                  <Icon name="icon-chevron-left" size={16} />
                </button>
                <span className="if-datecal__month">{monthLabel}</span>
                <button type="button" className="if-datecal__nav" aria-label="Next month" onClick={() => goMonth(1)}>
                  <Icon name="icon-chevron-right" size={16} />
                </button>
              </div>
              <div className="if-datecal__weekdays" aria-hidden="true">
                {weekdayLabels(weekStartsOn).map((w, i) => (
                  <span key={i} className="if-datecal__weekday">{w}</span>
                ))}
              </div>
              <div role="grid" className="if-datecal__grid">
                {Array.from({ length: 6 }, (_, w) => (
                  <div role="row" key={w} className="if-datecal__row">
                    {days.slice(w * 7, w * 7 + 7).map((d) => {
                      const iso = toISO(d);
                      const outside = d.getMonth() !== view.month;
                      const isDisabled = !isWithin(iso, min, max);
                      const sel = isEndpoint(iso);
                      return (
                        <button
                          key={iso}
                          ref={(node) => { dayRefs.current[iso] = node; }}
                          type="button"
                          role="gridcell"
                          aria-label={iso}
                          aria-selected={sel}
                          aria-disabled={isDisabled || undefined}
                          tabIndex={iso === focusISO ? 0 : -1}
                          className={classNames(
                            "if-datecal__day",
                            outside && "is-outside",
                            iso === todayISO && "is-today",
                            sel && "is-selected",
                            isDisabled && "is-disabled",
                          )}
                          onClick={() => selectDay(iso)}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {helperId ? <small id={helperId} className="if-field__helper">{error || helperText}</small> : null}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
```

- [ ] **Step 2: Append the CSS to `packages/ui-react/src/styles.css` (after the `.if-select` rules). Confirm each token exists in the file (grep `--if-shadow-panel`, `--if-z-overlay`, `--if-color-primary-soft`, `--if-field-height`); if a name differs, match the value used by `.if-select__panel`/`.if-select__option`.**

```css
.if-datepicker {
  position: relative;
}

.if-datepicker__trigger {
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

.if-datepicker__trigger:focus-visible {
  border-color: var(--if-color-primary);
  box-shadow: 0 0 0 3px var(--if-focus-ring);
  outline: 0;
}

.if-datepicker__value {
  flex: 1 1 auto;
  min-width: 0;
}

.if-datepicker__value.is-placeholder {
  color: var(--if-color-ink-subtle);
}

.if-datepicker__icon {
  align-items: center;
  color: var(--if-color-ink-subtle);
  display: inline-flex;
  flex: none;
}

.if-datepicker__popover {
  background: var(--if-color-surface-raised);
  border: 1px solid var(--if-color-hairline);
  border-radius: var(--if-radius-md);
  box-shadow: var(--if-shadow-panel);
  left: 0;
  margin-top: 4px;
  padding: var(--if-space-sm);
  position: absolute;
  top: 100%;
  width: 280px;
  z-index: var(--if-z-overlay);
}

.if-datecal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--if-space-xs);
}

.if-datecal__month {
  font-size: var(--if-font-size-body-sm);
  font-weight: var(--if-font-weight-emphasis);
}

.if-datecal__nav {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--if-radius-sm);
  color: var(--if-color-ink-muted);
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.if-datecal__nav:hover {
  background: var(--if-color-surface-1);
}

.if-datecal__weekdays,
.if-datecal__row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.if-datecal__weekday {
  color: var(--if-color-ink-subtle);
  font-size: var(--if-font-size-caption);
  padding: 4px 0;
  text-align: center;
}

.if-datecal__day {
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--if-radius-sm);
  color: var(--if-color-ink);
  cursor: pointer;
  display: flex;
  font-family: var(--if-font-family);
  font-size: var(--if-font-size-body-sm);
  height: 34px;
  justify-content: center;
}

.if-datecal__day:hover:not(.is-disabled) {
  background: var(--if-color-surface-1);
}

.if-datecal__day:focus-visible {
  box-shadow: 0 0 0 3px var(--if-focus-ring);
  outline: 0;
}

.if-datecal__day.is-outside {
  color: var(--if-color-ink-subtle);
}

.if-datecal__day.is-today {
  border-color: var(--if-color-hairline-strong);
}

.if-datecal__day.is-in-range {
  background: var(--if-color-primary-soft);
  border-radius: 0;
}

.if-datecal__day.is-selected {
  background: var(--if-color-primary);
  color: var(--if-color-inverse-ink);
}

.if-datecal__day.is-disabled {
  color: var(--if-color-ink-subtle);
  cursor: not-allowed;
}
```

- [ ] **Step 3: Verify.** Run: `npm run check` → both `ok` lines. (DatePicker isn't rendered anywhere yet; the playground example + browser verification happen in Task 5. The controller will visually verify then.)

- [ ] **Step 4: Commit.**

```bash
git add packages/ui-react/src/components/DatePicker.tsx packages/ui-react/src/styles.css
git commit -m "feat(ui-react): DatePicker 단일/기간 선택 달력 팝오버 + 스타일"
```

---

### Task 3: Range in-between highlight + hover preview + pending trigger display

**Files:** Modify `packages/ui-react/src/components/DatePicker.tsx`

The trigger already shows `pendingStart` while picking (Task 2 `display()`). This task adds the visual in-range band and hover preview.

- [ ] **Step 1: Add an `inRange(iso)` helper just before the `days` constant.**

```tsx
    const inRange = (iso: string): boolean => {
      if (!range) return false;
      let a = "";
      let b = "";
      if (pendingStart && hoverISO) {
        a = pendingStart <= hoverISO ? pendingStart : hoverISO;
        b = pendingStart <= hoverISO ? hoverISO : pendingStart;
      } else if (rangeVal.from && rangeVal.to) {
        a = rangeVal.from;
        b = rangeVal.to;
      }
      return Boolean(a && b && iso > a && iso < b);
    };
```

- [ ] **Step 2: Wire `inRange` into the day button `classNames` and add a hover handler.** In the day `<button>`, add `inRange(iso) && "is-in-range"` to the `classNames(...)` list, and add this prop:

```tsx
                          onMouseEnter={() => { if (range && pendingStart && !isDisabled) setHoverISO(iso); }}
```

- [ ] **Step 3: Verify.** Run: `npm run check` → both `ok` lines.

- [ ] **Step 4: Commit.**

```bash
git add packages/ui-react/src/components/DatePicker.tsx
git commit -m "feat(ui-react): DatePicker 기간 in-range 하이라이트 + hover 프리뷰"
```

---

### Task 4: Keyboard navigation + roving focus + Esc + open-focus

**Files:** Modify `packages/ui-react/src/components/DatePicker.tsx`

- [ ] **Step 1: Add a focus effect + an open-effect that initializes focus to the selected/anchor day. Place after the existing outside-click effect.**

```tsx
    React.useEffect(() => {
      if (open) dayRefs.current[focusISO]?.focus();
    }, [open, focusISO]);
```

- [ ] **Step 2: Add `setFocus` (moves focus, switching the visible month if needed) and `onGridKeyDown`. Place near `goMonth`.**

```tsx
    const setFocus = (iso: string) => {
      const d = parseISO(iso);
      if (d && (d.getFullYear() !== view.year || d.getMonth() !== view.month)) {
        setView({ year: d.getFullYear(), month: d.getMonth() });
      }
      setFocusISO(iso);
    };

    const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const cur = parseISO(focusISO) ?? new Date();
      const weekday = (cur.getDay() - weekStartsOn + 7) % 7;
      let next: Date | null = null;
      if (event.key === "ArrowLeft") next = addDays(cur, -1);
      else if (event.key === "ArrowRight") next = addDays(cur, 1);
      else if (event.key === "ArrowUp") next = addDays(cur, -7);
      else if (event.key === "ArrowDown") next = addDays(cur, 7);
      else if (event.key === "PageUp") next = addDays(cur, -28);
      else if (event.key === "PageDown") next = addDays(cur, 28);
      else if (event.key === "Home") next = addDays(cur, -weekday);
      else if (event.key === "End") next = addDays(cur, 6 - weekday);
      else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectDay(focusISO); return; }
      else if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (next) { event.preventDefault(); setFocus(toISO(next)); }
    };
```

- [ ] **Step 3: Wire `onGridKeyDown` onto the grid, and make ArrowDown/Enter/Space on the trigger open the popover.** On `<div role="grid" className="if-datecal__grid">` add `onKeyDown={onGridKeyDown}`. On the trigger `<button>` add:

```tsx
            onKeyDown={(event) => {
              if (disabled || open) return;
              if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen(true);
              }
            }}
```

Also reset `focusISO` to the anchor each time the popover opens so navigation starts from the selection. Replace the open effect from Step 1 with:

```tsx
    React.useEffect(() => {
      if (!open) return;
      setFocusISO(range ? rangeVal.from || todayISO : single || todayISO);
    }, [open]);

    React.useEffect(() => {
      if (open) dayRefs.current[focusISO]?.focus();
    }, [open, focusISO]);
```

- [ ] **Step 4: Verify.** Run: `npm run check` → both `ok` lines.

- [ ] **Step 5: Commit.**

```bash
git add packages/ui-react/src/components/DatePicker.tsx
git commit -m "feat(ui-react): DatePicker 키보드(화살표/Page/Home/End/Enter/Esc) + roving focus"
```

---

### Task 5: skeleton-check markers, export, playground, browser verification

**Files:** Modify `scripts/package-skeleton-check.js`, `packages/ui-react/src/index.ts`, `examples/playground/src/sections/Inputs.tsx`

- [ ] **Step 1: Export from `packages/ui-react/src/index.ts` (add near the other exports).**

```ts
export { DatePicker } from "./components/DatePicker";
export type { DatePickerProps, DateRange } from "./components/DatePicker";
```

- [ ] **Step 2: Add skeleton-check coverage in `scripts/package-skeleton-check.js` (mirror the existing component blocks). Verify each marker actually appears in the file before finalizing.**

```js
requireIncludes("packages/ui-react/src/components/DatePicker.tsx", [
  "export type DateRange",
  "role=\"dialog\"",
  "role=\"grid\"",
  "if-datepicker__trigger",
  "DatePicker.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-datepicker__trigger",
  ".if-datecal__grid",
  ".if-datecal__day",
]);
```
Also add `"packages/ui-react/src/components/DatePicker.tsx"` to the `requireFile` component list.

- [ ] **Step 3: Add examples to `examples/playground/src/sections/Inputs.tsx`. Import `DatePicker` from `@idenflu/ui-react` (add to the existing import) and add a Group inside the Section:**

```tsx
      <Group label="DatePicker — single / range">
        <Col>
          <DatePicker label="Due date" placeholder="Select date" onChange={() => {}} />
          <DatePicker label="Campaign period" range placeholder="Select range" onChange={() => {}} />
          <DatePicker label="Within June" min="2026-06-01" max="2026-06-30" defaultValue="2026-06-12" onChange={() => {}} />
        </Col>
      </Group>
```

- [ ] **Step 4: Verify gate + browser.** Run: `npm run check` → both `ok` lines. Then the controller (not the subagent) visually verifies in the `pg` preview: single (click a day → trigger shows ISO, closes), range (click start→end → highlighted band + `from ~ to`), min/max disables out-of-range days, keyboard (ArrowDown opens, arrows move focus across weeks/months, Enter selects, Esc closes), month nav buttons. No console errors.

- [ ] **Step 5: Commit.**

```bash
git add scripts/package-skeleton-check.js packages/ui-react/src/index.ts examples/playground/src/sections/Inputs.tsx
git commit -m "feat(ui-react): DatePicker export + skeleton-check 마커 + 플레이그라운드 예시"
```

---

## Phase B — docs mirror

### Task 6: docs date-time page demos + `[data-datepicker]` controller

**Files:** Modify `docs/script.js`, `docs/src/pages/components-date-time.html`, `docs/styles.css`

- [ ] **Step 1: Study the existing patterns.** Read the `[data-select-expanded]` controller in `docs/script.js` (it already builds a popover, handles outside-click/keyboard) and the `components-date-time.html` source. Read the `components-date-time.html`/blockedMarkers checks in `docs/scripts/verify-site.js` — DO NOT remove or reorder existing required markers/partials.

- [ ] **Step 2: Add a `[data-datepicker]` controller to `docs/script.js`** that, mirroring the Select-expanded controller, renders a month grid into `[data-datepicker-grid]` from `data-view` state, with: a trigger toggling a `role="dialog"` popover, prev/next month buttons (`[data-datepicker-prev]`/`[data-datepicker-next]`), a month label (`[data-datepicker-label]`), day buttons (built in JS from the viewed month), single vs `data-range` selection (range = 2-click + in-between highlight), keyboard (arrows/PageUp-Down/Enter/Escape), outside-click close, and trigger text update (`YYYY-MM-DD` / `from ~ to`). Reuse the existing date demo surface styling.

- [ ] **Step 3: Add demos to `docs/src/pages/components-date-time.html`** — a section (additive; keep all existing markers/partials and `id="context-example"` etc.) demoing a single DatePicker and a range DatePicker, marked up with the `data-datepicker*` attributes. Add a `React: <DatePicker ... />` note mentioning `range`, `min`/`max`, `weekStartsOn`.

- [ ] **Step 4: Add `docs/styles.css` deltas** for the calendar grid (header/nav/weekday/grid/day/today/selected/in-range/disabled), reusing docs tokens (`--primary`, `--surface-raised`, `--hairline`, `--ink-muted`, `--radius-sm`, `--primary-soft`, `--inverse-ink`).

- [ ] **Step 5: Build + verify + reproducibility.** Run: `node docs/scripts/build-site.js && npm run check` → `built N pages` + both `ok` lines. Then `node docs/scripts/build-site.js && git status` → no further diff. The controller will visually verify the docs demos afterward.

- [ ] **Step 6: Commit.**

```bash
git add docs/script.js docs/src/pages/components-date-time.html docs/components-date-time.html docs/styles.css
git commit -m "docs: DatePicker(단일/기간) 데모 + 달력 컨트롤러"
```

---

### Task 7: docs date-time API metadata

**Files:** Modify `docs/component-api.json`

- [ ] **Step 1: Update the `date-time` entry** in `docs/component-api.json` so props/states/accessibility reflect the DatePicker: add props `range`, `weekStartsOn`, `min`, `max`; states `range`, `disabled date`; accessibility `role=dialog`, `role=grid`, `keyboard date navigation` (keep existing entries). Keep the compact array format.

- [ ] **Step 2: Build + verify.** Run: `node docs/scripts/build-site.js && npm run check` → `built N pages` + both `ok` lines.

- [ ] **Step 3: Commit.**

```bash
git add docs/component-api.json docs/components-date-time.html docs/components.html
git commit -m "docs: date-time API contract에 DatePicker range/min/max/weekStartsOn 반영"
```

---

## Self-Review

**Spec coverage:**
- Custom calendar popover (not native input) → Task 2. ✓
- Single `<DatePicker>` + `range` prop → Task 2 (props), single+range selection. ✓
- Range = single calendar 2-click + highlight + hover preview, onChange on complete → Task 2 (`selectDay`) + Task 3 (highlight/hover). ✓
- ISO `YYYY-MM-DD` display, `~` range separator → Task 2 `display()`. ✓
- `weekStartsOn` 0|1 → Task 1 (`buildMonthGrid`/`weekdayLabels`) + Task 2. ✓
- `min`/`max` bounds, disabled days → Task 1 (`isWithin`) + Task 2. ✓
- field chrome (label/helper/error/required/state/disabled) → Task 2. ✓
- WAI-ARIA dialog + grid + keyboard (arrows/Page/Home/End/Enter/Esc/focus restore) → Task 2 (roles) + Task 4 (keyboard). ✓
- pure dateUtils → Task 1. ✓
- export + skeleton-check + playground → Task 5. ✓
- docs mirror (page + controller + api.json) → Tasks 6–7. ✓
- YAGNI (no time/timezone/presets/multi-month/year-dropdown/locale/typing) → not present. ✓

**Placeholder scan:** No TBD/TODO. Task 6 describes the docs controller by mirroring the in-repo Select-expanded controller rather than pasting ~200 lines — intentional (the source is in-repo); the executor adapts it.

**Type consistency:** `DateRange`, `DatePickerProps`, `selectDay`, `display`, `inRange`, `isEndpoint`, `setFocus`, `onGridKeyDown`, `goMonth`, `focusISO`, `pendingStart`, `hoverISO`, `view`, `dayRefs` are consistent across Tasks 2–4. `dateUtils` exports (`toISO`/`parseISO`/`addDays`/`addMonths`/`buildMonthGrid`/`weekdayLabels`/`isWithin`/`MONTH_LABELS`) match their use in DatePicker. The day button uses `role="gridcell"` inside `role="row"` inside `role="grid"` (valid grid structure).
