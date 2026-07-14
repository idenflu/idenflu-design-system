import * as React from "react";
import { cn } from "../../utils/classNames";
import {
  formatTime,
  formatTimeDisplay,
  formatTimeISO,
  parseTime,
  parseTimeValue,
  validateTimeInput,
} from "../../utils/dateUtils";
import { TimeScrollerPanel } from "../_pickers/TimeScrollerPanel";
import { PickerInput } from "../_pickers/PickerInput";
import type { PickerSize, PickerVariant } from "../_pickers/PickerInput";
import { usePickerInputValidation } from "../_pickers/usePickerInputValidation";
import { usePickerState } from "../_pickers/usePickerState";
import styles from "./TimePicker.module.css";

export type {
  PickerSize as TimePickerSize,
  PickerVariant as TimePickerVariant,
};

export type TimePickerProps = {
  "aria-label"?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  label?: React.ReactNode;
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
};

export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
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
    const [internal, setInternal] = React.useState(defaultValue ?? "");
    const timeVal = isControlled ? (value as string) : internal;
    const scrollerTime = parseTimeValue(timeVal) || "00:00:00";

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

    const emit = (nextTime: string) => {
      const next = formatTimeISO(nextTime);
      if (!isControlled) setInternal(next);
      onChange?.(next);
      clearInputError();
    };

    const handleInputBlur = (text: string): boolean => {
      const trimmed = text.trim();
      const validation = validateTimeInput(trimmed, { required });

      if (!validation.valid) {
        return failValidation(validation.message);
      }

      if (!trimmed) {
        clearInputError();
        if (!isControlled) setInternal("");
        onChange?.("");
        return true;
      }

      const parts = parseTime(trimmed);
      if (!parts) return failValidation("유효하지 않은 시간입니다.");

      emit(formatTime(parts[0], parts[1], parts[2]));
      return true;
    };

    const displayValue = timeVal ? formatTimeDisplay(timeVal) : undefined;

    return (
      <div className={cn(styles.wrapper, className)}>
        <PickerInput
          ref={setInputRef}
          containerRef={setContainerRef}
          id={baseId}
          inputMask="time"
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
          placeholder={placeholder ?? "HH:mm:ss"}
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
              typeof label === "string" ? label : (ariaLabel ?? "Time picker")
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
            <TimeScrollerPanel
              value={scrollerTime}
              onChange={emit}
              minutesStep={minutesStep}
              secondsStep={secondsStep}
            />
          </div>
        ) : null}
      </div>
    );
  }
);

TimePicker.displayName = "TimePicker";
