import * as React from "react";
import { classNames } from "../utils/classNames";
import { Icon } from "./Icon";
import type { FieldState } from "./TextField";
import { addDays, addMonths, buildMonthGrid, createDateFormatters, isWithin, parseISO, toISO } from "../utils/dateUtils";

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
  /**
   * 표시 텍스트(월 헤더·요일·트리거 값·일자 aria-label)를 현지화할 BCP 47 로캘.
   * 미지정 시 영어 기본 표기. value/onChange/min/max는 항상 ISO YYYY-MM-DD 유지.
   */
  locale?: string;
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
      range = false, value, defaultValue, onChange, min, max, weekStartsOn = 0, locale,
      placeholder, id, className,
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const baseId = id ?? generatedId;
    const labelId = `${baseId}-label`;
    const helperId = helperText || error ? `${baseId}-helper` : undefined;
    const popoverId = `${baseId}-popover`;

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
    const fmt = React.useMemo(() => createDateFormatters(locale), [locale]);

    const close = (focusTrigger = true) => {
      // Move focus to the trigger BEFORE unmounting the popover, so closing from a
      // day/nav button inside it doesn't drop focus to <body>.
      if (focusTrigger) triggerRef.current?.focus();
      setOpen(false);
      setPendingStart("");
      setHoverISO("");
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

    React.useEffect(() => {
      if (!open) return;
      const anchorOpen = range ? rangeVal.from || todayISO : single || todayISO;
      const d = parseISO(anchorOpen) ?? new Date();
      setView({ year: d.getFullYear(), month: d.getMonth() });
      setFocusISO(anchorOpen);
    }, [open]);

    React.useEffect(() => {
      if (open) dayRefs.current[focusISO]?.focus();
    }, [open, focusISO]);

    const display = (): string | null => {
      if (range) {
        if (pendingStart) return fmt.display(pendingStart);
        if (rangeVal.from && rangeVal.to) return `${fmt.display(rangeVal.from)} ~ ${fmt.display(rangeVal.to)}`;
        return null;
      }
      return single ? fmt.display(single) : null;
    };
    const shown = display();

    const goMonth = (delta: number) => {
      const d = addMonths(new Date(view.year, view.month, 1), delta);
      setView({ year: d.getFullYear(), month: d.getMonth() });
    };

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
      else if (event.key === "PageUp") {
        const last = new Date(cur.getFullYear(), cur.getMonth(), 0).getDate();
        next = new Date(cur.getFullYear(), cur.getMonth() - 1, Math.min(cur.getDate(), last));
      } else if (event.key === "PageDown") {
        const last = new Date(cur.getFullYear(), cur.getMonth() + 2, 0).getDate();
        next = new Date(cur.getFullYear(), cur.getMonth() + 1, Math.min(cur.getDate(), last));
      }
      else if (event.key === "Home") next = addDays(cur, -weekday);
      else if (event.key === "End") next = addDays(cur, 6 - weekday);
      else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectDay(focusISO); return; }
      // Escape is handled at the dialog level so it also works from the month-nav buttons.
      if (next) { event.preventDefault(); setFocus(toISO(next)); }
    };

    const isEndpoint = (iso: string): boolean =>
      range ? iso === rangeVal.from || iso === rangeVal.to || iso === pendingStart : iso === single;

    const inRange = (iso: string): boolean => {
      if (!range) return false;
      let a = "";
      let b = "";
      const previewEnd = hoverISO || focusISO;
      if (pendingStart && previewEnd) {
        a = pendingStart <= previewEnd ? pendingStart : previewEnd;
        b = pendingStart <= previewEnd ? previewEnd : pendingStart;
      } else if (rangeVal.from && rangeVal.to) {
        a = rangeVal.from;
        b = rangeVal.to;
      }
      return Boolean(a && b && iso > a && iso < b);
    };

    const days = buildMonthGrid(view.year, view.month, weekStartsOn);
    const monthLabel = fmt.monthLabel(view.year, view.month);

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
            aria-controls={open ? popoverId : undefined}
            disabled={disabled}
            onClick={() => { if (!disabled) setOpen((o) => !o); }}
            onKeyDown={(event) => {
              // Enter/Space open via the native button click; only ArrowDown needs a handler
              // (Space activates on keyup, which preventDefault on keydown cannot cancel).
              if (disabled || open) return;
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
              }
            }}
          >
            <span className={classNames("if-datepicker__value", !shown && "is-placeholder")}>
              {shown ?? placeholder ?? (range ? "Select range" : "Select date")}
            </span>
            <span className="if-datepicker__icon" aria-hidden="true">
              <Icon name="icon-calendar" size={16} />
            </span>
          </button>

          {open ? (
            <div
              ref={popoverRef}
              id={popoverId}
              role="dialog"
              aria-label={label}
              className="if-datepicker__popover"
              onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}
            >
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
                {fmt.weekdayLabels(weekStartsOn).map((w, i) => (
                  <span key={i} className="if-datecal__weekday">{w}</span>
                ))}
              </div>
              <div role="grid" className="if-datecal__grid" onKeyDown={onGridKeyDown}>
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
                          aria-label={fmt.dayLabel(d)}
                          aria-selected={sel}
                          aria-disabled={isDisabled || undefined}
                          tabIndex={iso === focusISO ? 0 : -1}
                          className={classNames(
                            "if-datecal__day",
                            outside && "is-outside",
                            iso === todayISO && "is-today",
                            inRange(iso) && "is-in-range",
                            sel && "is-selected",
                            isDisabled && "is-disabled",
                          )}
                          onMouseEnter={() => { if (range && pendingStart && !isDisabled) setHoverISO(iso); }}
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
