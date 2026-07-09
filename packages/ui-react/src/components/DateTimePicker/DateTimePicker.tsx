import * as React from "react";
import { cn } from "@/utils/classNames";
import {
  formatDateTimeDisplay,
  formatDateTimeISO,
  formatTime,
  parseDateTimeInput,
  parseDateTimeISO,
  toISO,
  validateDateTimeInput,
} from "../../utils/dateUtils";
import { CalendarPanel } from "../_pickers/CalendarPanel";
import { TimeScrollerPanel } from "../_pickers/TimeScrollerPanel";
import { PickerInput } from "../_pickers/PickerInput";
import type { PickerSize, PickerVariant } from "../_pickers/PickerInput";
import { usePickerInputValidation } from "../_pickers/usePickerInputValidation";
import { usePickerState } from "../_pickers/usePickerState";
import styles from "./DateTimePicker.module.css";
import { Divider } from "../Divider";

export type {
  PickerSize as DateTimePickerSize,
  PickerVariant as DateTimePickerVariant,
};

export type DateTimePickerProps = {
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
  minutesStep?: number;
  onChange?: (value: string) => void;
  onClose?: () => void;
  onOpen?: () => void;
  open?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  secondsStep?: number;
  size?: PickerSize;
  value?: string;
  variant?: PickerVariant;
  weekStartsOn?: 0 | 1;
};

const DEFAULT_TIME = "00:00:00";

export const DateTimePicker = React.forwardRef<
  HTMLInputElement,
  DateTimePickerProps
>(
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
      minutesStep = 1,
      onChange,
      onClose,
      onOpen,
      open: externalOpen,
      placeholder,
      readOnly,
      required,
      secondsStep = 1,
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
    const dtVal = isControlled ? (value as string) : internal;

    const parsed = parseDateTimeISO(dtVal);
    const dateVal = parsed?.date ?? "";
    const timeVal = parsed?.time ?? DEFAULT_TIME;

    const todayISO = React.useMemo(() => toISO(new Date()), []);
    const anchorISO = dateVal || todayISO;
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
      const anchor = dateVal || todayISO;
      const [y2, m2] = anchor.split("-").map(Number);
      setView({ year: y2, month: m2 - 1 });
      setFocusISO(anchor);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const emit = (nextDate: string, nextTime: string) => {
      if (!nextDate) return;
      const next = formatDateTimeISO(nextDate, nextTime);
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
    };

    const handleDateSelect = (iso: string) => {
      emit(iso, timeVal);
    };

    const handleTimeChange = (next: string) => {
      emit(dateVal || todayISO, next);
    };

    const handleMonthChange = (year: number, month: number) => {
      setView({ year, month });
      setFocusISO(`${year}-${String(month + 1).padStart(2, "0")}-01`);
    };

    const handleInputBlur = (text: string): boolean => {
      const trimmed = text.trim();
      const validation = validateDateTimeInput(trimmed, {
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

      const parsedInput = parseDateTimeInput(trimmed);
      if (!parsedInput) {
        return failValidation("유효하지 않은 날짜/시간입니다.");
      }

      emit(
        toISO(parsedInput),
        formatTime(
          parsedInput.getHours(),
          parsedInput.getMinutes(),
          parsedInput.getSeconds()
        )
      );
      return true;
    };

    const displayValue = dtVal ? formatDateTimeDisplay(dtVal) : undefined;

    return (
      <div className={cn(styles.wrapper, className)}>
        <PickerInput
          ref={setInputRef}
          containerRef={setContainerRef}
          id={baseId}
          inputMask="datetime"
          aria-label={ariaLabel}
          aria-controls={open ? popoverId : undefined}
          disabled={disabled}
          displayValue={displayValue}
          error={shownError}
          fullWidth={fullWidth}
          helperText={helperText}
          popupIconName={
            "calendar-clock" as Parameters<
              typeof PickerInput
            >[0]["popupIconName"]
          }
          popupButtonLabel="Open date and time picker"
          label={label}
          popupOpen={open}
          onInputBlur={handleInputBlur}
          onInputFocus={clearInputError}
          onPopupOpenChange={setPopupOpen}
          placeholder={placeholder ?? "YYYY-MM-DD HH:mm:ss"}
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
                : (ariaLabel ?? "Date and time picker")
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
            <div className={styles.panelRow}>
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
                onSelect={handleDateSelect}
              />
              <Divider orientation="vertical" fullWidth flexItem />
              <TimeScrollerPanel
                value={timeVal}
                onChange={handleTimeChange}
                minutesStep={minutesStep}
                secondsStep={secondsStep}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";
