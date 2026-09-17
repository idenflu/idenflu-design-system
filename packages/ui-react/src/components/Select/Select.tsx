import * as React from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/classNames";
import { Chip, type ChipSize } from "../Chip/Chip";
import { Icon } from "../Icon/Icon";
import inputSharedStyles from "../_fields/Field.module.css";
import styles from "./Select.module.css";
import { IconButton } from "../IconButton";

/**
 * Select field with optional panel search, multi-select, and chip values.
 * Custom listbox (no Radix). Prefer this over deprecated Combobox.
 */
export type SelectVariant = "default" | "filled" | "outlined";
export type SelectSize = "lg" | "md" | "sm";
export type SelectOverflow = "wrap" | "ellipsis";
/** How selected values render in the field. */
export type SelectValueDisplay = "chip" | "text";

export type SelectOption = {
  disabled?: boolean;
  label: React.ReactNode;
  textValue?: string;
  value: string;
};

export type SelectItemProps = {
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

const isSelectItemElement = (
  child: React.ReactNode
): child is React.ReactElement<SelectItemProps> => {
  if (!React.isValidElement(child)) return false;
  if (child.type === SelectItem) return true;
  const type = child.type;
  return (
    typeof type === "function" &&
    "displayName" in type &&
    (type as { displayName?: string }).displayName === "SelectItem"
  );
};

const collectOptionsFromChildren = (
  nodes: React.ReactNode,
  collected: SelectOption[] = []
): SelectOption[] => {
  React.Children.forEach(nodes, (child) => {
    if (!React.isValidElement(child)) return;
    if (isFragmentElement(child)) {
      collectOptionsFromChildren(child.props.children, collected);
      return;
    }
    if (isSelectItemElement(child)) {
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

const matchesQuery = (option: SelectOption, query: string) => {
  if (!query) return true;
  const haystack = (
    option.textValue ?? getTextValue(option.label)
  ).toLowerCase();
  return haystack.includes(query.toLowerCase());
};

/** Normalizes controlled/uncontrolled input to an internal `string[]`. */
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

const panelClassName = cva(styles.panel, {
  defaultVariants: { size: "md" },
  variants: {
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

/** Declarative option used as `children` of Select. Rendered by parent. */
export const SelectItem = (_props: SelectItemProps) => null;
SelectItem.displayName = "SelectItem";

type SelectStyle = React.CSSProperties & {
  "--nova-select-anchor-width"?: string;
};

export type SelectProps = {
  children?: React.ReactNode;
  /**
   * Selected value presentation.
   * - `chip` (default): chips for single and multiple.
   * - `text`: plain label text (comma-joined when multiple).
   */
  valueDisplay?: SelectValueDisplay;
  /**
   * Chip row overflow inside the field when chips are shown.
   * - `wrap` (default): chips wrap onto the next line.
   * - `ellipsis`: keep one line with horizontal scroll (scrollbar hidden).
   */
  overflow?: SelectOverflow;
  chipSize?: ChipSize;
  className?: string;
  defaultOpen?: boolean;
  /** `string` when single, `string[]` when `multiple`. */
  defaultValue?: string | string[];
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  id?: string;
  label?: React.ReactNode;
  multiple?: boolean;
  name?: string;
  onOpenChange?: (open: boolean) => void;
  /** Emits `string` when single, `string[]` when `multiple`. */
  onValueChange?: (value: string | string[]) => void;
  open?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  /** Show filter input at the top of the option panel. Defaults to `true`. */
  searchable?: boolean;
  searchPlaceholder?: string;
  size?: SelectSize;
  /** `string` when single, `string[]` when `multiple`. */
  value?: string | string[];
  variant?: SelectVariant;
};

export const Select = React.forwardRef<
  HTMLButtonElement,
  SelectProps
>(
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
      name,
      onOpenChange,
      onValueChange,
      open: openProp,
      options,
      overflow = "wrap",
      placeholder = "Select",
      readOnly = false,
      required,
      searchable = true,
      searchPlaceholder = "Search…",
      size = "md",
      value: valueProp,
      valueDisplay = "chip",
      variant = "default",
    },
    ref
  ) => {
    const generatedId = React.useId();
    const triggerId = id ?? generatedId;
    const listboxId = `${triggerId}-listbox`;
    const searchId = `${triggerId}-search`;
    const helperId = helperText || error ? `${triggerId}-helper` : undefined;
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
    const [panelRect, setPanelRect] = React.useState<{
      left: number;
      top: number;
      width: number;
    }>();

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const searchRef = React.useRef<HTMLInputElement | null>(null);
    const chipsRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(
      ref,
      () => triggerRef.current as HTMLButtonElement
    );

    const selectedValues = isValueControlled
      ? normalizeValues(valueProp, multiple)
      : uncontrolledValue;
    const open = isOpenControlled ? Boolean(openProp) : uncontrolledOpen;

    const optionItems = React.useMemo(
      () => options ?? collectOptionsFromChildren(children),
      [children, options]
    );

    const optionByValue = React.useMemo(() => {
      const map = new Map<string, SelectOption>();
      optionItems.forEach((option) => map.set(option.value, option));
      return map;
    }, [optionItems]);

    const filteredOptions = React.useMemo(
      () =>
        searchable
          ? optionItems.filter((option) => matchesQuery(option, query))
          : optionItems,
      [optionItems, query, searchable]
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
        const normalized = normalizeValues(nextValues, multiple);
        if (!isValueControlled) setUncontrolledValue(normalized);
        if (multiple) onValueChange?.(normalized);
        else onValueChange?.(normalized[0] ?? "");
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

    const updatePanelPosition = React.useCallback(() => {
      const node = anchorRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setPanelRect({
        left: rect.left,
        top: rect.bottom,
        width: rect.width,
      });
    }, []);

    React.useLayoutEffect(() => {
      if (!open) return;
      updatePanelPosition();

      const node = anchorRef.current;
      if (!node) return;

      const observer = new ResizeObserver(updatePanelPosition);
      observer.observe(node);
      window.addEventListener("resize", updatePanelPosition);
      window.addEventListener("scroll", updatePanelPosition, true);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updatePanelPosition);
        window.removeEventListener("scroll", updatePanelPosition, true);
      };
    }, [open, updatePanelPosition, selectedValues.length, overflow]);

    React.useEffect(() => {
      if (!open) return;
      if (searchable) {
        searchRef.current?.focus();
      } else {
        triggerRef.current?.focus();
      }
    }, [open, searchable]);

    React.useEffect(() => {
      if (!open) return;

      const handlePointerDown = (event: MouseEvent | TouchEvent) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (rootRef.current?.contains(target)) return;
        if (panelRef.current?.contains(target)) return;
        setOpen(false);
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("touchstart", handlePointerDown);
      };
    }, [open, setOpen]);

    React.useEffect(() => {
      if (overflow !== "ellipsis") return;
      const node = chipsRef.current;
      if (!node) return;
      node.scrollLeft = node.scrollWidth;
    }, [overflow, selectedValues.length]);

    React.useEffect(() => {
      if (highlightedIndex >= filteredOptions.length) {
        setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
      }
    }, [filteredOptions.length, highlightedIndex]);

    const handleTriggerKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
      if (locked) return;

      if (
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (locked) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((index) =>
          filteredOptions.length === 0
            ? 0
            : (index + 1) % filteredOptions.length
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((index) =>
          filteredOptions.length === 0
            ? 0
            : (index - 1 + filteredOptions.length) % filteredOptions.length
        );
        return;
      }

      if (event.key === "Enter") {
        const option = filteredOptions[highlightedIndex];
        if (option) {
          event.preventDefault();
          selectOption(option.value);
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const chipSizeResolved = chipSize ?? "sm";
    const useChips = valueDisplay === "chip";
    const panelStyle: SelectStyle = {
      "--nova-select-anchor-width": panelRect
        ? `${panelRect.width}px`
        : undefined,
      left: panelRect?.left,
      top: panelRect?.top,
    };

    const selectedLabels = selectedValues.map((selected) => {
      const option = optionByValue.get(selected);
      return option ? getTextValue(option.label) : selected;
    });

    const valueContent =
      selectedValues.length === 0 ? (
        <span className={styles.placeholder}>{placeholder}</span>
      ) : useChips ? (
        <div
          ref={chipsRef}
          className={cn(
            styles.valueArea,
            overflow === "ellipsis" && styles.valueAreaEllipsis
          )}
        >
          {selectedValues.map((selected, index) => {
            const chipLabel = selectedLabels[index] ?? selected;
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
                      : (event) => {
                          event.stopPropagation();
                          removeValue(selected);
                          triggerRef.current?.focus();
                        }
                  }
                >
                  {chipLabel}
                </Chip>
              </span>
            );
          })}
        </div>
      ) : (
        <span className={styles.textValue}>{selectedLabels.join(", ")}</span>
      );

    const fieldControl = (
      <div className={styles.controlRow}>
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-controls={open ? listboxId : undefined}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={hasError || undefined}
          aria-describedby={helperId}
          className={cn(inputSharedStyles.control, styles.trigger)}
          disabled={locked}
          onClick={() => {
            if (!locked) setOpen(!open);
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          {valueContent}
          <Icon
            name="keyboard-arrow-down"
            size={16}
            className={styles.chevron}
            aria-hidden="true"
          />
        </button>
      </div>
    );

    const hiddenInputs =
      name && selectedValues.length > 0
        ? selectedValues.map((selected) => (
            <input
              key={selected}
              type="hidden"
              name={multiple ? `${name}[]` : name}
              value={selected}
            />
          ))
        : null;

    const panel =
      open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={panelRef}
              className={panelClassName({ size })}
              data-size={size}
              data-state="open"
              style={panelStyle}
              onKeyDown={handlePanelKeyDown}
            >
              {searchable ? (
                <div className={styles.search}>
                  <input
                    ref={searchRef}
                    id={searchId}
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    autoComplete="off"
                    className={styles.searchInput}
                    disabled={locked}
                    placeholder={searchPlaceholder}
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setHighlightedIndex(0);
                    }}
                  />
                  <IconButton
                    aria-hidden="true"
                    color="neutral"
                    icon={<Icon name="restart" />}
                    label="검색 초기화"
                    variant="ghost"
                    onClick={() => setQuery("")}
                  />
                </div>
              ) : null}

              {filteredOptions.length === 0 ? (
                <div className={styles.empty}>No results</div>
              ) : (
                <ul
                  id={listboxId}
                  aria-label={typeof label === "string" ? label : "Options"}
                  aria-multiselectable={multiple || undefined}
                  className={styles.listbox}
                  role="listbox"
                >
                  {filteredOptions.map((option, index) => {
                    const selected = selectedValues.includes(option.value);
                    const highlighted = index === highlightedIndex;
                    return (
                      <li
                        key={option.value}
                        id={`${triggerId}-option-${option.value}`}
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
                        {selected ? (
                          <span className={styles.itemCheck} aria-hidden="true">
                            <Icon name="check" size={16} />
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>,
            document.body
          )
        : null;

    return (
      <>
        {hiddenInputs}
        <div
          ref={rootRef}
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
            <label className={inputSharedStyles.label} htmlFor={triggerId}>
              <span>{label}</span>
              {required ? (
                <span className={inputSharedStyles.required}>Required*</span>
              ) : null}
            </label>
          ) : null}

          {isFilled ? (
            <div
              ref={anchorRef}
              className={inputSharedStyles.controlWrapper}
            >
              {label ? (
                <label className={inputSharedStyles.label} htmlFor={triggerId}>
                  <span>{label}</span>
                  {required ? (
                    <span className={inputSharedStyles.required}>Required*</span>
                  ) : null}
                </label>
              ) : null}
              {fieldControl}
            </div>
          ) : (
            <div
              ref={anchorRef}
              className={inputSharedStyles.controlWrapper}
            >
              {fieldControl}
            </div>
          )}

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
        {panel}
      </>
    );
  }
);

Select.displayName = "Select";
