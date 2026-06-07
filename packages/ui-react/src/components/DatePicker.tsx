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

    const close = (focusTrigger = true) => {
      setOpen(false);
      setPendingStart("");
      setHoverISO("");
      if (focusTrigger) triggerRef.current?.focus();
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
          close(false);
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
