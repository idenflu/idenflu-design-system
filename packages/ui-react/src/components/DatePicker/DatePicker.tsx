import * as React from "react";
import { cn } from "@/utils/classNames";
import {
  formatDateDisplay,
  formatDateISO,
  parseDateValue,
  parseISO,
  toISO,
  validateDateInput,
} from "../../utils/dateUtils";
import { CalendarPanel } from "../_pickers/CalendarPanel";
import { PickerInput } from "../_pickers/PickerInput";
import type { PickerSize, PickerVariant } from "../_pickers/PickerInput";
import { usePickerInputValidation } from "../_pickers/usePickerInputValidation";
import { usePickerState } from "../_pickers/usePickerState";
import styles from "./DatePicker.module.css";

export type {
  PickerSize as DatePickerSize,
  PickerVariant as DatePickerVariant,
};

export type DatePickerProps = {
  "aria-label"?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  label?: React.ReactNode;
  locale?: string;
  maxDate?: string;
  minDate?: string;
  onChange?: (value: string) => void;
  onClose?: () => void;
  onOpen?: () => void;
  open?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: PickerSize;
  value?: string;
  variant?: PickerVariant;
  weekStartsOn?: 0 | 1;
};

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
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
    const [internal, setInternal] = React.useState(defaultValue ?? "");
    const selected = isControlled ? (value as string) : internal;
    const dateVal = parseDateValue(selected);

    const todayISO = React.useMemo(() => toISO(new Date()), []);
    const anchorISO = dateVal || todayISO;
    const [y, mo] = anchorISO.split("-").map(Number);
    const [view, setView] = React.useState({ year: y, month: mo - 1 });
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
      const anchor = dateVal || todayISO;
      const [ay, amo] = anchor.split("-").map(Number);
      setView({ year: ay, month: amo - 1 });
      setFocusISO(anchor);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const emit = (nextDate: string) => {
      const next = formatDateISO(nextDate);
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
    };

    const handleSelect = (iso: string) => {
      emit(iso);
      closePicker();
    };

    const handleMonthChange = (year: number, month: number) => {
      setView({ year, month });
      const newFocus = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      setFocusISO(newFocus);
    };

    const handleInputBlur = (text: string): boolean => {
      const trimmed = text.trim();
      const validation = validateDateInput(trimmed, {
        required,
        minDate,
        maxDate,
      });

      if (!validation.valid) {
        return failValidation(validation.message);
      }

      if (!trimmed) {
        clearInputError();
        if (!isControlled) setInternal("");
        onChange?.("");
        return true;
      }

      const date = parseISO(trimmed);
      if (!date) return failValidation("유효하지 않은 날짜입니다.");

      const next = formatDateISO(toISO(date));
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
      return true;
    };

    const displayValue = selected ? formatDateDisplay(selected) : undefined;

    return (
      <div className={cn(styles.wrapper, className)}>
        <PickerInput
          ref={setInputRef}
          containerRef={setContainerRef}
          id={baseId}
          inputMask="date"
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
          placeholder={placeholder ?? "yyyy-mm-dd"}
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
              typeof label === "string" ? label : (ariaLabel ?? "Date picker")
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
              selectedISO={dateVal || undefined}
              minDate={minDate}
              maxDate={maxDate}
              weekStartsOn={weekStartsOn}
              locale={locale}
              onMonthChange={handleMonthChange}
              onFocusChange={setFocusISO}
              onSelect={handleSelect}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
