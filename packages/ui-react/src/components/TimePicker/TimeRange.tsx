import * as React from "react";
import { cn } from "../../utils/classNames";
import {
  formatTimeDisplay,
  formatTimeISO,
  parseTimeValue,
  splitRangeInput,
  validateTimeRangeInput,
} from "../../utils/dateUtils";
import { TimeScrollerPanel } from "../_pickers/TimeScrollerPanel";
import { PickerInput } from "../_pickers/PickerInput";
import type { PickerSize, PickerVariant } from "../_pickers/PickerInput";
import { usePickerInputValidation } from "../_pickers/usePickerInputValidation";
import { usePickerState } from "../_pickers/usePickerState";
import { Button } from "../Button/Button";
import styles from "./TimePicker.module.css";

export type TimeRangeValue = { from: string; to: string | null };

export type TimeRangeProps = {
  "aria-label"?: string;
  className?: string;
  defaultValue?: TimeRangeValue;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  label?: React.ReactNode;
  minutesStep?: number;
  onChange?: (value: TimeRangeValue) => void;
  onClose?: () => void;
  onOpen?: () => void;
  open?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  secondsStep?: number;
  size?: PickerSize;
  value?: TimeRangeValue;
  variant?: PickerVariant;
};

type RangeStep = "from" | "to";

const EMPTY_RANGE: TimeRangeValue = { from: "", to: null };
const DEFAULT_TIME = "00:00:00";

const isBeforeTime = (from: string, to: string) => to < from;

export const TimeRange = React.forwardRef<HTMLInputElement, TimeRangeProps>(
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
    },
    ref
  ) => {
    const generatedId = React.useId();
    const baseId = id ?? generatedId;
    const popoverId = `${baseId}-popover`;

    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<TimeRangeValue>(
      defaultValue ?? EMPTY_RANGE
    );
    const rangeVal = isControlled ? (value as TimeRangeValue) : internal;

    const fromTime = parseTimeValue(rangeVal.from) || DEFAULT_TIME;
    const toTime = rangeVal.to ? parseTimeValue(rangeVal.to) : null;

    const [step, setStep] = React.useState<RangeStep>("from");
    const [draftFromTime, setDraftFromTime] = React.useState(DEFAULT_TIME);
    const [draftToTime, setDraftToTime] = React.useState(DEFAULT_TIME);
    const [stepError, setStepError] = React.useState<string | null>(null);

    const activeTime = step === "from" ? draftFromTime : draftToTime;

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
      setStep("from");
      setStepError(null);
      setDraftFromTime(fromTime);
      setDraftToTime(toTime ?? fromTime);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const commitRange = (next: TimeRangeValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
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

    const handleNext = () => {
      const nextFrom = formatTimeISO(draftFromTime);
      commitRange({ from: nextFrom, to: rangeVal.to });
      if (!rangeVal.to) {
        setDraftToTime(draftFromTime);
      }
      setStep("to");
    };

    const handleBack = () => {
      setStepError(null);
      setStep("from");
    };

    const handleDone = () => {
      const nextFrom = formatTimeISO(draftFromTime);
      const nextTo = formatTimeISO(draftToTime);

      if (isBeforeTime(draftFromTime, draftToTime)) {
        setStepError("종료 시간은 시작 시간 이후여야 합니다.");
        return;
      }

      commitRange({ from: nextFrom, to: nextTo });
      closePicker();
    };

    const handleInputBlur = (text: string): boolean => {
      const trimmed = text.trim();
      const validation = validateTimeRangeInput(trimmed, { required });

      if (!validation.valid) {
        return failValidation(validation.message);
      }

      if (!trimmed) {
        clearInputError();
        return true;
      }

      const parts = splitRangeInput(trimmed);
      if (!parts) {
        return failValidation("HH:mm:ss – HH:mm:ss 형식으로 입력해 주세요.");
      }

      if (parts.length === 1) {
        const next = formatTimeISO(parts[0]);
        const updated: TimeRangeValue = { from: next, to: null };
        if (!isControlled) setInternal(updated);
        onChange?.(updated);
        clearInputError();
        return true;
      }

      const next: TimeRangeValue = {
        from: formatTimeISO(parts[0]),
        to: formatTimeISO(parts[1]),
      };
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
      return true;
    };

    const displayValue = (() => {
      if (rangeVal.from && rangeVal.to) {
        return `${formatTimeDisplay(rangeVal.from)} – ${formatTimeDisplay(rangeVal.to)}`;
      }
      if (rangeVal.from) return formatTimeDisplay(rangeVal.from);
      return undefined;
    })();

    return (
      <div className={cn(styles.wrapper, className)}>
        <PickerInput
          ref={setInputRef}
          containerRef={setContainerRef}
          className={styles.timeRange}
          id={baseId}
          inputMask="timeRange"
          aria-label={ariaLabel}
          aria-controls={open ? popoverId : undefined}
          disabled={disabled}
          displayValue={displayValue}
          error={shownError}
          fullWidth={fullWidth}
          helperText={helperText}
          popupIconName="clock"
          popupButtonLabel="Open time picker"
          label={label}
          popupOpen={open}
          onInputBlur={handleInputBlur}
          onInputFocus={clearInputError}
          onPopupOpenChange={setPopupOpen}
          placeholder={placeholder ?? "HH:mm:ss – HH:mm:ss"}
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
                : (ariaLabel ?? "Time range picker")
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
        ) : null}
      </div>
    );
  }
);

TimeRange.displayName = "TimeRange";
