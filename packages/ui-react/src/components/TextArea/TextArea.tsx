import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import type { TextInputVariant } from "../TextInput/TextInput";
import textAreaStyles from "./TextArea.module.css";
import inputSharedStyles from "../_fields/Field.module.css";

export type TextAreaVariant = TextInputVariant;

export type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "rows" | "cols"
> & {
  autoGrow?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  label?: string;
  maxRows?: number;
  minRows?: number;
  rows?: number;
  showCount?: boolean;
  variant?: TextAreaVariant;
};

const textAreaClassName = cva(inputSharedStyles.root, {
  defaultVariants: {
    autoGrow: false,
    disabled: false,
    error: false,
    fullWidth: false,
    readOnly: false,
    variant: "default",
  },
  variants: {
    autoGrow: {
      false: null,
      true: inputSharedStyles.autoGrow,
    },
    disabled: {
      false: null,
      true: inputSharedStyles.disabled,
    },
    error: {
      false: null,
      true: inputSharedStyles.error,
    },
    fullWidth: {
      false: null,
      true: inputSharedStyles.fullWidth,
    },
    readOnly: {
      false: null,
      true: inputSharedStyles.readOnly,
    },
    variant: {
      default: inputSharedStyles.variantDefault,
      filled: inputSharedStyles.variantFilled,
      outlined: inputSharedStyles.variantOutlined,
    },
  },
});

function getLineHeight(element: HTMLTextAreaElement): number {
  const style = window.getComputedStyle(element);
  const lineHeight = Number.parseFloat(style.lineHeight);
  if (Number.isFinite(lineHeight)) {
    return lineHeight;
  }
  const fontSize = Number.parseFloat(style.fontSize);
  return Number.isFinite(fontSize) ? fontSize * 1.2 : 16;
}

function getVerticalBoxExtras(element: HTMLTextAreaElement): number {
  const style = window.getComputedStyle(element);
  return (
    Number.parseFloat(style.paddingTop) +
    Number.parseFloat(style.paddingBottom) +
    Number.parseFloat(style.borderTopWidth) +
    Number.parseFloat(style.borderBottomWidth)
  );
}

function resizeTextarea(
  element: HTMLTextAreaElement,
  minRows: number,
  maxRows?: number
): void {
  const lineHeight = getLineHeight(element);
  const boxExtras = getVerticalBoxExtras(element);
  const minHeight = lineHeight * minRows + boxExtras;
  const maxHeight =
    maxRows != null ? lineHeight * maxRows + boxExtras : undefined;

  element.style.height = "auto";
  let nextHeight = Math.max(element.scrollHeight, minHeight);

  if (maxHeight != null) {
    nextHeight = Math.min(nextHeight, maxHeight);
    element.style.overflowY = nextHeight >= maxHeight ? "auto" : "hidden";
  } else {
    element.style.overflowY = "hidden";
  }

  element.style.height = `${nextHeight}px`;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      autoGrow = false,
      className,
      defaultValue,
      disabled,
      error,
      fullWidth = false,
      helperText,
      id,
      label,
      maxLength,
      maxRows,
      minRows,
      onChange,
      readOnly,
      required,
      rows = 4,
      showCount = false,
      value,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const helperId = helperText || error ? `${textareaId}-helper` : undefined;
    const countId =
      showCount && maxLength != null ? `${textareaId}-count` : undefined;
    const describedBy =
      [ariaDescribedBy, helperId, countId].filter(Boolean).join(" ") ||
      undefined;
    const hasError = Boolean(error);
    const isFilled = variant === "filled";
    const resolvedMinRows = minRows ?? rows;
    const showCounter = showCount && maxLength != null;

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [uncontrolledLength, setUncontrolledLength] = React.useState(() => {
      if (value != null) {
        return String(value).length;
      }
      if (defaultValue != null) {
        return String(defaultValue).length;
      }
      return 0;
    });

    const charCount =
      value !== undefined ? String(value).length : uncontrolledLength;

    const setTextareaRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const syncHeight = React.useCallback(() => {
      const element = textareaRef.current;
      if (!element || !autoGrow) {
        return;
      }
      resizeTextarea(element, resolvedMinRows, maxRows);
    }, [autoGrow, maxRows, resolvedMinRows]);

    React.useLayoutEffect(() => {
      syncHeight();
    }, [syncHeight, value, charCount]);

    React.useEffect(() => {
      if (
        process.env.NODE_ENV !== "production" &&
        showCount &&
        maxLength == null
      ) {
        console.warn("TextArea: showCount requires maxLength.");
      }
    }, [maxLength, showCount]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setUncontrolledLength(event.target.value.length);
      }
      if (autoGrow) {
        resizeTextarea(event.target, resolvedMinRows, maxRows);
      }
      onChange?.(event);
    };

    const textarea = (
      <textarea
        ref={setTextareaRef}
        id={textareaId}
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        className={cn(inputSharedStyles.control, textAreaStyles.control)}
        disabled={disabled}
        maxLength={maxLength}
        readOnly={readOnly}
        required={required}
        rows={autoGrow ? resolvedMinRows : rows}
        onChange={handleChange}
        {...(value !== undefined ? { value } : { defaultValue })}
        {...props}
      />
    );

    const hasFooter = Boolean(helperId || showCounter);

    return (
      <div
        className={cn(
          textAreaClassName({
            autoGrow,
            disabled,
            error: hasError,
            fullWidth,
            readOnly,
            variant,
          }),
          className
        )}
      >
        {!isFilled && label ? (
          <label className={inputSharedStyles.label} htmlFor={textareaId}>
            <span>{label}</span>
            {required ? (
              <span className={inputSharedStyles.required}>Required*</span>
            ) : null}
          </label>
        ) : null}

        {isFilled ? (
          <label
            className={inputSharedStyles.controlWrapper}
            htmlFor={textareaId}
          >
            {label ? (
              <span className={inputSharedStyles.label}>
                <span>{label}</span>
                {required ? (
                  <span className={inputSharedStyles.required}>Required*</span>
                ) : null}
              </span>
            ) : null}
            {textarea}
          </label>
        ) : (
          <div className={inputSharedStyles.controlWrapper}>{textarea}</div>
        )}

        {hasFooter ? (
          <div className={textAreaStyles.footer}>
            {helperId ? (
              <p
                id={helperId}
                className={cn(
                  inputSharedStyles.helper,
                  textAreaStyles.helper,
                  hasError && inputSharedStyles.helperError
                )}
              >
                {error || helperText}
              </p>
            ) : (
              <span className={textAreaStyles.footerSpacer} />
            )}
            {showCounter ? (
              <p
                id={countId}
                className={textAreaStyles.count}
                aria-live="polite"
              >
                {charCount} / {maxLength}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
