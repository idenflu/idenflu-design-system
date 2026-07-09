import * as React from "react";
import { cn } from "@/utils/classNames";
import {
  formatDateDisplay,
  formatDateISO,
  parseDateValue,
  splitRangeInput,
  toISO,
  validateDateRangeInput,
} from "../../utils/dateUtils";
import { CalendarPanel } from "../_pickers/CalendarPanel";
import { PickerInput } from "../_pickers/PickerInput";
import type { PickerSize, PickerVariant } from "../_pickers/PickerInput";
import { usePickerInputValidation } from "../_pickers/usePickerInputValidation";
import { usePickerState } from "../_pickers/usePickerState";
import styles from "./DatePicker.module.css";

export type DateRangeValue = { from: string; to: string | null };

export type DateRangeProps = {
  "aria-label"?: string;
  className?: string;
  defaultValue?: DateRangeValue;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  label?: React.ReactNode;
  locale?: string;
  maxDate?: string;
  minDate?: string;
  onChange?: (value: DateRangeValue) => void;
  onClose?: () => void;
  onOpen?: () => void;
  open?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: PickerSize;
  value?: DateRangeValue;
  variant?: PickerVariant;
  weekStartsOn?: 0 | 1;
};

const EMPTY_RANGE: DateRangeValue = { from: "", to: null };

export const DateRange = React.forwardRef<HTMLInputElement, DateRangeProps>(
  (
    {
      "aria-label": ariaLabel,
      className,
      defaultValue,
      disabled,
      error,
      fullWidth,
      helperText,
      id,
      label,
      locale,
      maxDate,
      minDate,
      onChange,
      onClose,
      onOpen,
      open: externalOpen,
      placeholder,
      readOnly,
      required,
      size,
      value,
      variant,
      weekStartsOn = 0,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const baseId = id ?? generatedId;
    const popoverId = `${baseId}-popover`;

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<DateRangeValue>(
      defaultValue ?? EMPTY_RANGE
    );
    const rangeVal = isControlled ? (value as DateRangeValue) : internal;

    const [pendingFrom, setPendingFrom] = React.useState("");
    const [hoverISO, setHoverISO] = React.useState("");

    const fromDate = parseDateValue(rangeVal.from);
    const toDate = rangeVal.to ? parseDateValue(rangeVal.to) : null;

    const todayISO = React.useMemo(() => toISO(new Date()), []);
    const anchorISO = fromDate || todayISO;
    const [ay, amo] = anchorISO.split("-").map(Number);
    const [view, setView] = React.useState({ year: ay, month: amo - 1 });
    const [focusISO, setFocusISO] = React.useState(anchorISO);

    const { shownError, clearInputError, failValidation } =
      usePickerInputValidation(error);

    const { open, triggerRef, popoverRef, setPopupOpen, closePicker } =
      usePickerState({ externalOpen, onOpen, onClose });

    const setContainerRef = React.useCallback(
      (node: HTMLElement | null) => {
        triggerRef.current = node;
      },
      [triggerRef]
    );

    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      if (!open) return;
      const anchor = fromDate || todayISO;
      const [y2, m2] = anchor.split("-").map(Number);
      setView({ year: y2, month: m2 - 1 });
      setFocusISO(anchor);
      setPendingFrom("");
      setHoverISO("");
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = (iso: string) => {
      // Phase 2: pendingFrom 이 있으면 범위를 완성한다.
      if (pendingFrom) {
        const [a, b] =
          iso >= pendingFrom ? [pendingFrom, iso] : [iso, pendingFrom];
        const next: DateRangeValue = {
          from: formatDateISO(a),
          to: formatDateISO(b),
        };
        if (!isControlled) setInternal(next);
        onChange?.(next);
        setPendingFrom("");
        clearInputError();
        // closePicker();
        return;
      }

      const { from: currentFrom, to: currentTo } = rangeVal;

      // Phase 1-A: from, to 가 모두 확정된 상태에서 재선택
      if (currentFrom && currentTo) {
        const currentToDate = parseDateValue(currentTo);
        if (iso <= currentToDate) {
          const next: DateRangeValue = {
            from: formatDateISO(iso),
            to: currentTo,
          };
          if (!isControlled) setInternal(next);
          onChange?.(next);
          clearInputError();
          // closePicker();
        } else {
          // to 이후 → from 을 해당 날짜로 바꾸고 to 는 초기화
          // 커밋된 범위를 숨기고 pendingFrom 으로 전환하여 to 재선택 대기
          setPendingFrom(iso);
          setHoverISO("");
        }
        return;
      }

      // Phase 1-B: 범위가 없거나 from 만 있는 초기 상태 → pendingFrom 시작
      setPendingFrom(iso);
      setHoverISO("");
    };

    const handleMonthChange = (year: number, month: number) => {
      setView({ year, month });
      setFocusISO(`${year}-${String(month + 1).padStart(2, "0")}-01`);
    };

    const handleInputBlur = (text: string): boolean => {
      const trimmed = text.trim();
      const validation = validateDateRangeInput(trimmed, {
        required,
        minDate,
        maxDate,
      });

      if (!validation.valid) {
        return failValidation(validation.message);
      }

      if (!trimmed) {
        clearInputError();
        return true;
      }

      const parts = splitRangeInput(trimmed);
      if (!parts) {
        return failValidation(
          "YYYY-MM-DD ~ YYYY-MM-DD 형식으로 입력해 주세요."
        );
      }

      if (parts.length === 1) {
        const next = formatDateISO(parts[0]);
        const updated: DateRangeValue = { from: next, to: null };
        if (!isControlled) setInternal(updated);
        onChange?.(updated);
        clearInputError();
        return true;
      }

      const [fromDate, toDate] = parts;
      const next: DateRangeValue = {
        from: formatDateISO(fromDate),
        to: formatDateISO(toDate),
      };
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
      return true;
    };

    const displayValue = (() => {
      if (pendingFrom) return pendingFrom;
      if (rangeVal.from && rangeVal.to) {
        return `${formatDateDisplay(rangeVal.from)} ~ ${formatDateDisplay(rangeVal.to)}`;
      }
      if (rangeVal.from) return formatDateDisplay(rangeVal.from);
      return undefined;
    })();

    return (
      <div className={cn(styles.wrapper, className)}>
        <PickerInput
          ref={setInputRef}
          containerRef={setContainerRef}
          className={styles.dateRange}
          id={baseId}
          inputMask="dateRange"
          aria-label={ariaLabel}
          aria-controls={open ? popoverId : undefined}
          disabled={disabled}
          displayValue={displayValue}
          error={shownError}
          fullWidth={fullWidth}
          helperText={helperText}
          popupIconName="calendar"
          popupButtonLabel="Open calendar"
          label={label}
          popupOpen={open}
          onInputBlur={handleInputBlur}
          onInputFocus={clearInputError}
          onPopupOpenChange={setPopupOpen}
          placeholder={placeholder ?? "YYYY-MM-DD ~ YYYY-MM-DD"}
          readOnly={readOnly}
          required={required}
          size={size}
          variant={variant}
        />

        {open ? (
          <div
            ref={(el) => {
              popoverRef.current = el;
            }}
            id={popoverId}
            role="dialog"
            aria-label={
              typeof label === "string"
                ? label
                : (ariaLabel ?? "Date range picker")
            }
            aria-modal="true"
            className={styles.popover}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                closePicker();
              }
            }}
          >
            <CalendarPanel
              year={view.year}
              month={view.month}
              focusISO={focusISO}
              rangeFrom={pendingFrom ? undefined : fromDate || undefined}
              rangeTo={pendingFrom ? null : toDate}
              pendingFrom={pendingFrom || undefined}
              hoverISO={pendingFrom ? hoverISO : undefined}
              minDate={minDate}
              maxDate={maxDate}
              weekStartsOn={weekStartsOn}
              locale={locale}
              onMonthChange={handleMonthChange}
              onFocusChange={setFocusISO}
              onSelect={handleSelect}
              onHover={(iso) => {
                if (pendingFrom) setHoverISO(iso);
              }}
              onHoverEnd={() => setHoverISO("")}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

DateRange.displayName = "DateRange";
