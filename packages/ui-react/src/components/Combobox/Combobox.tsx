import { Popover as PopoverPrimitive } from "radix-ui";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/classNames";
import { Chip, type ChipSize } from "../Chip/Chip";
import { Icon } from "../Icon/Icon";
import inputSharedStyles from "../_fields/Field.module.css";
import styles from "./Combobox.module.css";

export type ComboboxVariant = "default" | "filled" | "outlined";
export type ComboboxSize = "lg" | "md" | "sm";
/** How chips overflow inside the field control when `multiple`. */
export type ComboboxOverflow = "wrap" | "ellipsis";

export type ComboboxOption = {
  disabled?: boolean;
  label: React.ReactNode;
  textValue?: string;
  value: string;
};

export type ComboboxItemProps = {
  children: React.ReactNode;
  disabled?: boolean;
  textValue?: string;
  value: string;
};

const getTextValue = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextValue).join(" ");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextValue(node.props.children);
  }
  return "";
};

const REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");

const isFragmentElement = (
  child: React.ReactElement
): child is React.ReactElement<{ children?: React.ReactNode }> =>
  child.type === React.Fragment ||
  (child.type as unknown) === REACT_FRAGMENT_TYPE;

const isComboboxItemElement = (
  child: React.ReactNode
): child is React.ReactElement<ComboboxItemProps> => {
  if (!React.isValidElement(child)) return false;
  if (child.type === ComboboxItem) return true;
  const type = child.type;
  return (
    typeof type === "function" &&
    "displayName" in type &&
    (type as { displayName?: string }).displayName === "ComboboxItem"
  );
};

const collectOptionsFromChildren = (
  nodes: React.ReactNode,
  collected: ComboboxOption[] = []
): ComboboxOption[] => {
  React.Children.forEach(nodes, (child) => {
    if (!React.isValidElement(child)) return;
    if (isFragmentElement(child)) {
      collectOptionsFromChildren(child.props.children, collected);
      return;
    }
    if (isComboboxItemElement(child)) {
      const { children: label, disabled, textValue, value } = child.props;
      collected.push({
        disabled,
        label,
        textValue: textValue ?? getTextValue(label),
        value,
      });
    }
  });
  return collected;
};

const matchesQuery = (option: ComboboxOption, query: string) => {
  if (!query) return true;
  const haystack = (
    option.textValue ?? getTextValue(option.label)
  ).toLowerCase();
  return haystack.includes(query.toLowerCase());
};

const normalizeValues = (
  value: string | string[] | undefined,
  multiple: boolean
): string[] => {
  if (value === undefined) return [];
  if (multiple) return Array.isArray(value) ? value : value ? [value] : [];
  return Array.isArray(value) ? value.slice(0, 1) : value ? [value] : [];
};

const rootClassName = cva([inputSharedStyles.root, styles.root], {
  defaultVariants: {
    disabled: false,
    error: false,
    fullWidth: false,
    readOnly: false,
    size: "md",
    variant: "default",
  },
  variants: {
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
    size: {
      lg: inputSharedStyles.sizeLg,
      md: inputSharedStyles.sizeMd,
      sm: inputSharedStyles.sizeSm,
    },
    variant: {
      default: inputSharedStyles.variantDefault,
      filled: inputSharedStyles.variantFilled,
      outlined: inputSharedStyles.variantOutlined,
    },
  },
});

const contentClassName = cva(styles.content, {
  defaultVariants: { size: "md" },
  variants: {
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

/** Declarative option used as `children` of Combobox. Rendered by parent. */
export const ComboboxItem = (_props: ComboboxItemProps) => null;
ComboboxItem.displayName = "ComboboxItem";

type ComboboxStyle = React.CSSProperties & {
  "--nova-combobox-anchor-width"?: string;
};

export type ComboboxProps = {
  children?: React.ReactNode;
  /**
   * Chip row overflow inside the input field when `multiple`.
   * - `wrap` (default): chips wrap onto the next line.
   * - `ellipsis`: keep one line with horizontal scroll (scrollbar hidden).
   */
  overflow?: ComboboxOverflow;
  /** Chip size for multi-select values. Defaults to `sm`; pass `md` explicitly when needed. */
  chipSize?: ChipSize;
  className?: string;
  defaultOpen?: boolean;
  defaultValue?: string | string[];
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  label?: React.ReactNode;
  multiple?: boolean;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: string | string[]) => void;
  open?: boolean;
  options?: ComboboxOption[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: ComboboxSize;
  value?: string | string[];
  variant?: ComboboxVariant;
};

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      children,
      chipSize,
      className,
      defaultOpen = false,
      defaultValue,
      disabled = false,
      error,
      fullWidth = false,
      helperText,
      id,
      label,
      multiple = false,
      onOpenChange,
      onValueChange,
      open: openProp,
      options,
      overflow = "wrap",
      placeholder = "Search…",
      readOnly = false,
      required,
      size = "md",
      value: valueProp,
      variant = "default",
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const listboxId = `${inputId}-listbox`;
    const helperId = helperText || error ? `${inputId}-helper` : undefined;
    const hasError = Boolean(error);
    const isFilled = variant === "filled";
    const locked = disabled || readOnly;

    const isValueControlled = valueProp !== undefined;
    const isOpenControlled = openProp !== undefined;

    const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
      normalizeValues(defaultValue, multiple)
    );
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const [query, setQuery] = React.useState("");
    const [highlightedIndex, setHighlightedIndex] = React.useState(0);
    const [anchorWidth, setAnchorWidth] = React.useState<number>();

    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const chipsRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const selectedValues = isValueControlled
      ? normalizeValues(valueProp, multiple)
      : uncontrolledValue;
    const open = isOpenControlled ? Boolean(openProp) : uncontrolledOpen;

    const optionItems = React.useMemo(
      () => options ?? collectOptionsFromChildren(children),
      [children, options]
    );

    const optionByValue = React.useMemo(() => {
      const map = new Map<string, ComboboxOption>();
      optionItems.forEach((option) => map.set(option.value, option));
      return map;
    }, [optionItems]);

    const filteredOptions = React.useMemo(
      () => optionItems.filter((option) => matchesQuery(option, query)),
      [optionItems, query]
    );

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (locked && nextOpen) return;
        if (!isOpenControlled) setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
        if (!nextOpen) {
          setQuery("");
          setHighlightedIndex(0);
        }
      },
      [isOpenControlled, locked, onOpenChange]
    );

    const emitValue = React.useCallback(
      (nextValues: string[]) => {
        if (!isValueControlled) setUncontrolledValue(nextValues);
        if (multiple) onValueChange?.(nextValues);
        else onValueChange?.(nextValues[0] ?? "");
      },
      [isValueControlled, multiple, onValueChange]
    );

    const selectOption = React.useCallback(
      (optionValue: string) => {
        const option = optionByValue.get(optionValue);
        if (!option || option.disabled || locked) return;

        if (multiple) {
          const exists = selectedValues.includes(optionValue);
          const next = exists
            ? selectedValues.filter((value) => value !== optionValue)
            : [...selectedValues, optionValue];
          emitValue(next);
          setQuery("");
          return;
        }

        emitValue([optionValue]);
        setQuery("");
        setOpen(false);
      },
      [emitValue, locked, multiple, optionByValue, selectedValues, setOpen]
    );

    const removeValue = React.useCallback(
      (optionValue: string) => {
        if (locked) return;
        emitValue(selectedValues.filter((value) => value !== optionValue));
      },
      [emitValue, locked, selectedValues]
    );

    React.useEffect(() => {
      if (!open) return;
      const node = anchorRef.current;
      if (!node) return;

      const updateWidth = () => setAnchorWidth(node.getBoundingClientRect().width);
      updateWidth();

      const observer = new ResizeObserver(updateWidth);
      observer.observe(node);
      return () => observer.disconnect();
    }, [open]);

    React.useEffect(() => {
      if (overflow !== "ellipsis") return;
      const node = chipsRef.current;
      if (!node) return;
      node.scrollLeft = node.scrollWidth;
    }, [overflow, selectedValues.length, query]);

    React.useEffect(() => {
      if (highlightedIndex >= filteredOptions.length) {
        setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
      }
    }, [filteredOptions.length, highlightedIndex]);

    const handleOpenChange = (nextOpen: boolean) => {
      if (locked && nextOpen) return;
      setOpen(nextOpen);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (locked) return;
      setQuery(event.target.value);
      setHighlightedIndex(0);
      if (!open) setOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (locked) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setHighlightedIndex((index) =>
          filteredOptions.length === 0
            ? 0
            : (index + 1) % filteredOptions.length
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setHighlightedIndex((index) =>
          filteredOptions.length === 0
            ? 0
            : (index - 1 + filteredOptions.length) % filteredOptions.length
        );
        return;
      }

      if (event.key === "Enter") {
        const option = filteredOptions[highlightedIndex];
        if (open && option) {
          event.preventDefault();
          selectOption(option.value);
        }
        return;
      }

      if (event.key === "Escape") {
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      }

      if (
        event.key === "Backspace" &&
        multiple &&
        query.length === 0 &&
        selectedValues.length > 0
      ) {
        event.preventDefault();
        removeValue(selectedValues[selectedValues.length - 1]!);
      }
    };

    const singleSelectedLabel =
      !multiple && selectedValues[0]
        ? getTextValue(optionByValue.get(selectedValues[0])?.label ?? "")
        : "";

    const inputDisplayValue =
      multiple || open ? query : query || singleSelectedLabel;

    const chipSizeResolved = chipSize ?? "sm";
    const contentStyle: ComboboxStyle = {
      "--nova-combobox-anchor-width": anchorWidth
        ? `${anchorWidth}px`
        : undefined,
    };

    const labelNode = label ? (
      <span className={inputSharedStyles.label}>
        <span>{label}</span>
        {required ? (
          <span className={inputSharedStyles.required}>Required*</span>
        ) : null}
      </span>
    ) : null;

    const fieldControl = (
      <div ref={anchorRef} className={styles.controlRow}>
        {multiple && selectedValues.length > 0 ? (
          <div
            ref={chipsRef}
            className={cn(
              styles.chips,
              overflow === "ellipsis" && styles.chipsEllipsis
            )}
          >
            {selectedValues.map((selected) => {
              const option = optionByValue.get(selected);
              const chipLabel = option
                ? getTextValue(option.label)
                : selected;
              return (
                <span key={selected} className={styles.chipSlot}>
                  <Chip
                    color="neutral"
                    deleteLabel={`Remove ${chipLabel}`}
                    size={chipSizeResolved}
                    variant="filled"
                    onDelete={
                      locked
                        ? undefined
                        : () => {
                            removeValue(selected);
                            inputRef.current?.focus();
                          }
                    }
                  >
                    {chipLabel}
                  </Chip>
                </span>
              );
            })}
            <input
              ref={inputRef}
              id={inputId}
              aria-activedescendant={
                open && filteredOptions[highlightedIndex]
                  ? `${inputId}-option-${filteredOptions[highlightedIndex]!.value}`
                  : undefined
              }
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-invalid={hasError || undefined}
              aria-describedby={helperId}
              autoComplete="off"
              className={cn(inputSharedStyles.control, styles.input)}
              disabled={disabled}
              placeholder={selectedValues.length === 0 ? placeholder : undefined}
              readOnly={readOnly}
              required={required && selectedValues.length === 0}
              role="combobox"
              value={inputDisplayValue}
              onChange={handleInputChange}
              onClick={() => {
                if (!locked) setOpen(true);
              }}
              onFocus={() => {
                if (!locked) setOpen(true);
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <input
            ref={inputRef}
            id={inputId}
            aria-activedescendant={
              open && filteredOptions[highlightedIndex]
                ? `${inputId}-option-${filteredOptions[highlightedIndex]!.value}`
                : undefined
            }
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={hasError || undefined}
            aria-describedby={helperId}
            autoComplete="off"
            className={cn(inputSharedStyles.control, styles.input)}
            disabled={disabled}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            role="combobox"
            value={inputDisplayValue}
            onChange={handleInputChange}
            onClick={() => {
              if (!locked) setOpen(true);
            }}
            onFocus={() => {
              if (!locked) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />
        )}
        <Icon
          name="keyboard-arrow-down"
          size={16}
          className={styles.chevron}
          aria-hidden="true"
        />
      </div>
    );

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <div
          className={cn(
            rootClassName({
              disabled,
              error: hasError,
              fullWidth,
              readOnly,
              size,
              variant,
            }),
            locked && styles.disabled,
            className
          )}
        >
          {!isFilled && label ? (
            <label className={inputSharedStyles.label} htmlFor={inputId}>
              <span>{label}</span>
              {required ? (
                <span className={inputSharedStyles.required}>Required*</span>
              ) : null}
            </label>
          ) : null}

          <PopoverPrimitive.Anchor asChild>
            {isFilled ? (
              <label
                className={inputSharedStyles.controlWrapper}
                htmlFor={inputId}
              >
                {labelNode}
                {fieldControl}
              </label>
            ) : (
              <div className={inputSharedStyles.controlWrapper}>
                {fieldControl}
              </div>
            )}
          </PopoverPrimitive.Anchor>

          {helperId ? (
            <p
              id={helperId}
              className={cn(
                inputSharedStyles.helper,
                hasError && inputSharedStyles.helperError
              )}
            >
              {error || helperText}
            </p>
          ) : null}
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            className={contentClassName({ size })}
            data-size={size}
            side="bottom"
            sideOffset={0}
            style={contentStyle}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              const target = event.target;
              if (
                target instanceof Node &&
                anchorRef.current?.contains(target)
              ) {
                event.preventDefault();
              }
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className={styles.empty}>No results</div>
            ) : (
              <ul
                id={listboxId}
                aria-label={
                  typeof label === "string" ? label : "Suggestions"
                }
                className={styles.listbox}
                role="listbox"
                aria-multiselectable={multiple || undefined}
              >
                {filteredOptions.map((option, index) => {
                  const selected = selectedValues.includes(option.value);
                  const highlighted = index === highlightedIndex;
                  return (
                    <li
                      key={option.value}
                      id={`${inputId}-option-${option.value}`}
                      aria-disabled={option.disabled || undefined}
                      aria-selected={selected}
                      className={styles.item}
                      data-disabled={option.disabled || undefined}
                      data-highlighted={highlighted || undefined}
                      data-selected={selected || undefined}
                      role="option"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        selectOption(option.value);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className={styles.itemLabel}>{option.label}</span>
                      {multiple && selected ? (
                        <span className={styles.itemCheck} aria-hidden="true">
                          <Icon name="check" size={16} />
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);

Combobox.displayName = "Combobox";
