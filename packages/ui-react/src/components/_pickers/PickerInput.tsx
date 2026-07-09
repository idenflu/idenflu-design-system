import * as React from "react";
import { cn } from "@/utils/classNames";
import type { IconName } from "@idenflu/ui-icons";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { TextInput } from "../TextInput/TextInput";
import textInputStyles from "../TextInput/TextInput.module.css";
import styles from "./PickerInput.module.css";
import type { PickerInputMask } from "./pickerInputMask";
import {
  adjustSectionValue,
  applyDigitToSection,
  areSectionsEmpty,
  backspaceSection,
  clearSection,
  findSectionIndexAtCaret,
  getSectionRanges,
  parseValueToSections,
  sectionsToCommitValue,
  sectionsToString,
  type FieldSection,
} from "./pickerFieldSections";

export type { PickerInputMask };

export type PickerVariant = "default" | "filled" | "outlined";
export type PickerSize = "lg" | "md" | "sm";

export type PickerInputProps = {
  "aria-describedby"?: string;
  "aria-label"?: string;
  "aria-controls"?: string;
  className?: string;
  containerRef?: React.Ref<HTMLElement>;
  disabled?: boolean;
  displayValue?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  inputMask?: PickerInputMask;
  label?: React.ReactNode;
  /** `false`를 반환하면 입력값을 마지막 유효 값으로 되돌립니다. */
  onInputBlur?: (value: string) => boolean | void;
  onInputChange?: (value: string) => void;
  onInputFocus?: () => void;
  onPopupOpenChange?: (open: boolean) => void;
  placeholder?: string;
  popupButtonLabel?: string;
  popupIconName: IconName;
  popupOpen?: boolean;
  range?: boolean;
  readOnly?: boolean;
  required?: boolean;
  size?: PickerSize;
  variant?: PickerVariant;
};

export const PickerInput = React.forwardRef<HTMLInputElement, PickerInputProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      "aria-controls": ariaControls,
      className,
      containerRef,
      disabled = false,
      displayValue,
      error,
      fullWidth = false,
      helperText,
      id,
      inputMask,
      label,
      onInputBlur,
      onInputChange,
      onInputFocus,
      onPopupOpenChange,
      placeholder = "Select Date",
      popupButtonLabel = "Open picker",
      popupIconName,
      popupOpen = false,
      range = false,
      readOnly = false,
      required,
      size = "md",
      variant = "default",
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const isFocusedRef = React.useRef(false);
    const activeSectionRef = React.useRef(0);
    const sectionsRef = React.useRef<FieldSection[]>([]);
    const pendingSelectionRef = React.useRef<{
      start: number;
      end: number;
    } | null>(null);

    const [sections, setSections] = React.useState<FieldSection[]>(() =>
      inputMask ? parseValueToSections(inputMask, displayValue) : []
    );
    const [localValue, setLocalValue] = React.useState(displayValue ?? "");

    const setInputNode = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    React.useEffect(() => {
      sectionsRef.current = sections;
    }, [sections]);

    const syncFromDisplayValue = React.useCallback(
      (value: string | undefined) => {
        if (!inputMask) {
          setLocalValue(value ?? "");
          return;
        }
        const nextSections = parseValueToSections(inputMask, value);
        setSections(nextSections);
        setLocalValue(
          areSectionsEmpty(nextSections) ? "" : sectionsToString(nextSections)
        );
      },
      [inputMask]
    );

    React.useEffect(() => {
      if (!inputMask) {
        if (!isFocusedRef.current) {
          syncFromDisplayValue(displayValue);
        }
        return;
      }

      const parsed = parseValueToSections(inputMask, displayValue);
      const externalText = areSectionsEmpty(parsed)
        ? ""
        : sectionsToString(parsed);
      const currentText = areSectionsEmpty(sectionsRef.current)
        ? ""
        : sectionsToString(sectionsRef.current);

      if (externalText !== currentText) {
        syncFromDisplayValue(displayValue);
      }
    }, [displayValue, inputMask, syncFromDisplayValue]);

    const wasPopupOpenRef = React.useRef(popupOpen);

    React.useEffect(() => {
      if (wasPopupOpenRef.current && !popupOpen) {
        syncFromDisplayValue(displayValue);
      }
      wasPopupOpenRef.current = popupOpen;
    }, [popupOpen, displayValue, syncFromDisplayValue]);

    const selectSection = React.useCallback(
      (nextSections: FieldSection[], index: number) => {
        const safeIndex = Math.max(0, Math.min(index, nextSections.length - 1));
        activeSectionRef.current = safeIndex;
        const ranges = getSectionRanges(nextSections);
        const rangePos = ranges[safeIndex];
        if (!rangePos) return;
        pendingSelectionRef.current = rangePos;
        requestAnimationFrame(() => {
          const input = inputRef.current;
          const pending = pendingSelectionRef.current;
          if (!input || !pending) return;
          input.setSelectionRange(pending.start, pending.end);
        });
      },
      []
    );

    const publishSections = React.useCallback(
      (nextSections: FieldSection[], nextIndex: number) => {
        const text = areSectionsEmpty(nextSections)
          ? ""
          : sectionsToString(nextSections);
        setSections(nextSections);
        setLocalValue(text);
        onInputChange?.(text);
        selectSection(nextSections, nextIndex);
      },
      [onInputChange, selectSection]
    );

    const handlePopupOpenChange = (nextOpen: boolean) => {
      onPopupOpenChange?.(nextOpen);
    };

    const popupButton = (
      <IconButton
        label={popupButtonLabel}
        disabled={disabled || readOnly}
        variant="ghost"
        size="xs"
        color="neutral"
        icon={<Icon name={popupIconName} aria-hidden="true" />}
        aria-expanded={popupOpen}
        aria-haspopup="dialog"
        aria-controls={popupOpen ? ariaControls : undefined}
        onClick={() => handlePopupOpenChange(!popupOpen)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !popupOpen && !readOnly && !disabled) {
            e.preventDefault();
            handlePopupOpenChange(true);
          }
        }}
        className={textInputStyles.actionButton}
      />
    );

    const handleSectionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!inputMask || readOnly || disabled) return;

      const currentSections = sectionsRef.current;
      const index = activeSectionRef.current;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        selectSection(currentSections, Math.max(0, index - 1));
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        selectSection(
          currentSections,
          Math.min(currentSections.length - 1, index + 1)
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        publishSections(adjustSectionValue(currentSections, index, 1), index);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        publishSections(adjustSectionValue(currentSections, index, -1), index);
        return;
      }

      if (e.key === "Tab") {
        if (e.shiftKey && index > 0) {
          e.preventDefault();
          selectSection(currentSections, index - 1);
          return;
        }
        if (!e.shiftKey && index < currentSections.length - 1) {
          e.preventDefault();
          selectSection(currentSections, index + 1);
          return;
        }
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        const result = backspaceSection(currentSections, index);
        publishSections(result.sections, result.nextIndex);
        return;
      }

      if (e.key === "Delete") {
        e.preventDefault();
        publishSections(clearSection(currentSections, index), index);
        return;
      }

      if (e.key.length === 1 && /\d/.test(e.key)) {
        e.preventDefault();
        const editing =
          currentSections[index].value.length >=
          currentSections[index].maxLength
            ? clearSection(currentSections, index)
            : currentSections;
        const result = applyDigitToSection(editing, index, e.key);
        if (result.edited) {
          publishSections(result.sections, result.nextIndex);
        }
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!inputMask || readOnly || disabled) return;
      e.preventDefault();
      const pasted = e.clipboardData.getData("text");
      const nextSections = parseValueToSections(inputMask, pasted);
      if (areSectionsEmpty(nextSections) && pasted.trim()) {
        return;
      }
      publishSections(nextSections, 0);
    };

    const handleSelect = () => {
      if (!inputMask || readOnly || disabled) return;
      const input = inputRef.current;
      if (!input) return;
      const caret = input.selectionStart ?? 0;
      const index = findSectionIndexAtCaret(sectionsRef.current, caret);
      selectSection(sectionsRef.current, index);
    };

    const handleMouseUp = () => {
      handleSelect();
    };

    const handleFocus = () => {
      isFocusedRef.current = true;
      onInputFocus?.();
      if (!inputMask) return;

      const next = parseValueToSections(inputMask, displayValue);
      setSections(next);
      setLocalValue(sectionsToString(next));
      selectSection(next, 0);
    };

    const handleBlur = () => {
      isFocusedRef.current = false;
      if (!inputMask) {
        const committed = onInputBlur?.(localValue);
        if (committed === false) {
          setLocalValue(displayValue ?? "");
        }
        return;
      }

      const commitValue = areSectionsEmpty(sectionsRef.current)
        ? ""
        : sectionsToCommitValue(inputMask, sectionsRef.current);
      const committed = onInputBlur?.(commitValue);
      if (committed === false) {
        syncFromDisplayValue(displayValue);
      }
    };

    return (
      <TextInput
        ref={setInputNode}
        controlRef={containerRef}
        id={id}
        className={cn(
          styles.root,
          range && styles.range,
          fullWidth && styles.fullWidth,
          className
        )}
        label={label}
        value={localValue}
        placeholder={placeholder}
        inputMode={inputMask ? "numeric" : undefined}
        aria-describedby={ariaDescribedBy}
        aria-label={label ? undefined : ariaLabel}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        error={error}
        helperText={helperText}
        size={size}
        variant={variant}
        fullWidth={fullWidth}
        endAdornment={popupButton}
        onChange={(e) => {
          if (inputMask || readOnly || disabled) return;
          setLocalValue(e.target.value);
          onInputChange?.(e.target.value);
        }}
        onKeyDown={(e) => {
          if (inputMask) {
            handleSectionKeyDown(e);
          }
        }}
        onPaste={inputMask ? handlePaste : undefined}
        onSelect={inputMask ? handleSelect : undefined}
        onMouseUp={inputMask ? handleMouseUp : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }
);

PickerInput.displayName = "PickerInput";
