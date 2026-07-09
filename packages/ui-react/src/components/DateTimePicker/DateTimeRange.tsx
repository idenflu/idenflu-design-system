import * as React from "react";
import { cn } from "@/utils/classNames";
import {
  formatDateTimeDisplay,
  formatDateTimeISO,
  formatTime,
  parseDateTimeInput,
  parseDateTimeISO,
  splitRangeInput,
  toISO,
  validateDateTimeRangeInput,
} from "../../utils/dateUtils";
import { CalendarPanel } from "../_pickers/CalendarPanel";
import { TimeScrollerPanel } from "../_pickers/TimeScrollerPanel";
import { PickerInput } from "../_pickers/PickerInput";
import type { PickerSize, PickerVariant } from "../_pickers/PickerInput";
import { usePickerInputValidation } from "../_pickers/usePickerInputValidation";
import { usePickerState } from "../_pickers/usePickerState";
import { Button } from "../Button/Button";
import { Divider } from "../Divider";
import styles from "./DateTimePicker.module.css";

export type DateTimeRangeValue = {
  from: string;
  to: string | null;
};

export type DateTimeRangeProps = {
  "aria-label"?: string;
  className?: string;
  defaultValue?: DateTimeRangeValue;
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
  onChange?: (value: DateTimeRangeValue) => void;
  onClose?: () => void;
  onOpen?: () => void;
  open?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  secondsStep?: number;
  size?: PickerSize;
  value?: DateTimeRangeValue;
  variant?: PickerVariant;
  weekStartsOn?: 0 | 1;
};

type RangeStep = "from" | "to";

const EMPTY_RANGE: DateTimeRangeValue = { from: "", to: null };
const DEFAULT_TIME = "00:00:00";

const isBeforeDateTime = (from: string, to: string) =>
  new Date(to).getTime() < new Date(from).getTime();

export const DateTimeRange = React.forwardRef<
  HTMLInputElement,
  DateTimeRangeProps
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
    const [internal, setInternal] = React.useState<DateTimeRangeValue>(
      defaultValue ?? EMPTY_RANGE
    );
    const rangeVal = isControlled ? (value as DateTimeRangeValue) : internal;

    const parsedFrom = parseDateTimeISO(rangeVal.from);
    const parsedTo = rangeVal.to ? parseDateTimeISO(rangeVal.to) : null;

    const fromDate = parsedFrom?.date ?? "";
    const toDate = parsedTo?.date ?? null;
    const fromTime = parsedFrom?.time ?? DEFAULT_TIME;
    const toTime = parsedTo?.time ?? DEFAULT_TIME;

    const [step, setStep] = React.useState<RangeStep>("from");
    const [draftFromDate, setDraftFromDate] = React.useState("");
    const [draftFromTime, setDraftFromTime] = React.useState(DEFAULT_TIME);
    const [draftToDate, setDraftToDate] = React.useState("");
    const [draftToTime, setDraftToTime] = React.useState(DEFAULT_TIME);
    const [stepError, setStepError] = React.useState<string | null>(null);

    const todayISO = React.useMemo(() => toISO(new Date()), []);

    const activeDate = step === "from" ? draftFromDate : draftToDate;
    const activeTime = step === "from" ? draftFromTime : draftToTime;
    const anchorISO = activeDate || todayISO;
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

    const syncViewToDate = React.useCallback((iso: string) => {
      const [y2, m2] = iso.split("-").map(Number);
      setView({ year: y2, month: m2 - 1 });
      setFocusISO(iso);
    }, []);

    React.useEffect(() => {
      if (!open) return;
      setStep("from");
      setStepError(null);
      setDraftFromDate(fromDate);
      setDraftFromTime(fromTime);
      setDraftToDate(toDate ?? fromDate ?? todayISO);
      setDraftToTime(toDate ? toTime : fromTime);
      syncViewToDate(fromDate || todayISO);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const commitRange = (next: DateTimeRangeValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
      setStepError(null);
    };

    const handleDateSelect = (iso: string) => {
      if (step === "from") {
        setDraftFromDate(iso);
      } else {
        setDraftToDate(iso);
      }
      setStepError(null);
    };

    const handleTimeChange = (nextTime: string) => {
      if (step === "from") {
        setDraftFromTime(nextTime);
      } else {
        setDraftToTime(nextTime);
      }
      setStepError(null);
    };

    const handleMonthChange = (year: number, month: number) => {
      setView({ year, month });
      setFocusISO(`${year}-${String(month + 1).padStart(2, "0")}-01`);
    };

    const handleNext = () => {
      const nextFrom = formatDateTimeISO(
        draftFromDate || todayISO,
        draftFromTime
      );
      if (!nextFrom) {
        setStepError("시작 날짜와 시간을 선택해 주세요.");
        return;
      }

      commitRange({ from: nextFrom, to: rangeVal.to });
      setDraftToDate(
        draftToDate || parseDateTimeISO(nextFrom)?.date || todayISO
      );
      if (!rangeVal.to) {
        setDraftToTime(draftFromTime);
      }
      setStep("to");
      syncViewToDate(
        draftToDate || parseDateTimeISO(nextFrom)?.date || todayISO
      );
    };

    const handleBack = () => {
      setStepError(null);
      setStep("from");
      syncViewToDate(draftFromDate || todayISO);
    };

    const handleDone = () => {
      const nextFrom = formatDateTimeISO(
        draftFromDate || todayISO,
        draftFromTime
      );
      const nextTo = formatDateTimeISO(draftToDate || todayISO, draftToTime);

      if (!nextFrom || !nextTo) {
        setStepError("종료 날짜와 시간을 선택해 주세요.");
        return;
      }

      if (isBeforeDateTime(nextFrom, nextTo)) {
        setStepError("종료 일시는 시작 일시 이후여야 합니다.");
        return;
      }

      commitRange({ from: nextFrom, to: nextTo });
      closePicker();
    };

    const toStoredDateTime = (display: string): string | null => {
      const parsed = parseDateTimeInput(display);
      if (!parsed) return null;
      return formatDateTimeISO(
        toISO(parsed),
        formatTime(parsed.getHours(), parsed.getMinutes(), parsed.getSeconds())
      );
    };

    const handleInputBlur = (text: string): boolean => {
      const trimmed = text.trim();
      const validation = validateDateTimeRangeInput(trimmed, {
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
          "YYYY-MM-DD HH:mm:ss – YYYY-MM-DD HH:mm:ss 형식으로 입력해 주세요."
        );
      }

      if (parts.length === 1) {
        const from = toStoredDateTime(parts[0]);
        if (!from) {
          return failValidation("유효하지 않은 날짜/시간입니다.");
        }
        const updated: DateTimeRangeValue = { from, to: null };
        if (!isControlled) setInternal(updated);
        onChange?.(updated);
        clearInputError();
        return true;
      }

      const from = toStoredDateTime(parts[0]);
      const to = toStoredDateTime(parts[1]);
      if (!from || !to) {
        return failValidation("유효하지 않은 날짜/시간입니다.");
      }

      const next: DateTimeRangeValue = { from, to };
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
      return true;
    };

    const displayValue = (() => {
      if (rangeVal.from && rangeVal.to) {
        return `${formatDateTimeDisplay(rangeVal.from)} – ${formatDateTimeDisplay(rangeVal.to)}`;
      }
      if (rangeVal.from) return formatDateTimeDisplay(rangeVal.from);
      return undefined;
    })();

    const stepMinDate =
      step === "to"
        ? draftFromDate || parseDateTimeISO(rangeVal.from)?.date || minDate
        : minDate;

    return (
      <div className={cn(styles.wrapper, className)}>
        <PickerInput
          ref={setInputRef}
          containerRef={setContainerRef}
          className={styles.dateTimeRange}
          id={baseId}
          inputMask="datetimeRange"
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
          placeholder={
            placeholder ?? "YYYY-MM-DD HH:mm:ss – YYYY-MM-DD HH:mm:ss"
          }
          range
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
                : (ariaLabel ?? "Date and time range picker")
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
            <div className={styles.rangeStepHeader}>
              <span
                className={cn(
                  styles.rangeStepTitle,
                  step === "from" && styles.rangeStepTitleActive
                )}
              >
                From
              </span>
              <span className={styles.rangeStepDivider} aria-hidden="true" />
              <span
                className={cn(
                  styles.rangeStepTitle,
                  step === "to" && styles.rangeStepTitleActive
                )}
              >
                To
              </span>
            </div>

            <div className={styles.panelRow}>
              <CalendarPanel
                year={view.year}
                month={view.month}
                focusISO={focusISO}
                selectedISO={activeDate || undefined}
                minDate={stepMinDate}
                maxDate={maxDate}
                weekStartsOn={weekStartsOn}
                locale={locale}
                onMonthChange={handleMonthChange}
                onFocusChange={setFocusISO}
                onSelect={handleDateSelect}
              />
              <Divider orientation="vertical" fullWidth flexItem />
              <div className={styles.timeColumn}>
                <TimeScrollerPanel
                  value={activeTime}
                  onChange={handleTimeChange}
                  minutesStep={minutesStep}
                  secondsStep={secondsStep}
                />
                {stepError ? (
                  <p className={styles.rangeStepError} role="alert">
                    {stepError}
                  </p>
                ) : null}
                <div className={styles.rangeStepFooter}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      styles.rangeStepButton,
                      step !== "to" && styles.rangeStepButtonHidden
                    )}
                    aria-hidden={step !== "to"}
                    tabIndex={step === "to" ? 0 : -1}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  {step === "from" ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={styles.rangeStepButton}
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className={styles.rangeStepButton}
                      onClick={handleDone}
                    >
                      Done
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);

DateTimeRange.displayName = "DateTimeRange";
