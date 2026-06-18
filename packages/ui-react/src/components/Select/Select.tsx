import * as React from "react";
import { classNames } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import "./Select.css";

export type SelectVariant = "default" | "filled" | "outlined";
export type SelectSize = "lg" | "md" | "sm";
export type SelectItemSize = "lg" | "md" | "sm" | "xs";

type SelectItemData = {
  disabled?: boolean;
  endIcon?: React.ReactNode;
  label: React.ReactNode;
  startIcon?: React.ReactNode;
  textValue?: string;
  value: string;
};

export type SelectItemProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "children"
> & {
  active?: boolean;
  as?: "div" | "li";
  children: React.ReactNode;
  disabled?: boolean;
  endIcon?: React.ReactNode;
  selected?: boolean;
  size?: SelectItemSize;
  startIcon?: React.ReactNode;
  textValue?: string;
  value: string;
};

export type SelectProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> & {
  children?: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  label?: React.ReactNode;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  required?: boolean;
  size?: SelectSize;
  value?: string;
  variant?: SelectVariant;
};

const SELECT_ITEM_NAME = "SelectItem";

const getTextValue = (node: React.ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextValue).join(" ");
  return "";
};

const getOptionId = (baseId: string, value: string) =>
  `${baseId}-option-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

const isSelectItemElement = (
  child: React.ReactNode
): child is React.ReactElement<SelectItemProps> =>
  React.isValidElement<SelectItemProps>(child) &&
  (child.type as { displayName?: string }).displayName === SELECT_ITEM_NAME;

const collectOptionsFromChildren = (
  children: React.ReactNode,
  options: SelectItemData[] = []
) => {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) {
      collectOptionsFromChildren(
        (child.props as { children?: React.ReactNode }).children,
        options
      );
      return;
    }

    if (!isSelectItemElement(child)) return;

    const {
      children: label,
      disabled,
      endIcon,
      startIcon,
      textValue,
      value,
    } = child.props;
    options.push({
      disabled,
      endIcon,
      label,
      startIcon,
      textValue: textValue ?? getTextValue(label),
      value,
    });
  });

  return options;
};

export const SelectItem = React.forwardRef<HTMLElement, SelectItemProps>(
  (
    {
      active = false,
      as = "div",
      children,
      className,
      disabled = false,
      endIcon,
      selected = false,
      size = "md",
      startIcon,
      textValue: _textValue,
      value: _value,
      ...props
    },
    ref
  ) => {
    const itemClassName = classNames(
      "nova-select__item",
      `nova-select__item--${size}`,
      selected && "nova-select__item--selected",
      disabled && "nova-select__item--disabled",
      active && "nova-select__item--active",
      className
    );

    const content = (
      <>
        {startIcon ? (
          <span className="nova-select__item-start-icon" aria-hidden="true">
            {startIcon}
          </span>
        ) : null}
        <span className="nova-select__item-label">{children}</span>
        {endIcon ? (
          <span className="nova-select__item-end-icon" aria-hidden="true">
            {endIcon}
          </span>
        ) : null}
      </>
    );

    if (as === "li") {
      return (
        <li
          ref={ref as React.Ref<HTMLLIElement>}
          className={itemClassName}
          aria-disabled={disabled || undefined}
          {...props}
        >
          {content}
        </li>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={itemClassName}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {content}
      </div>
    );
  }
);

SelectItem.displayName = SELECT_ITEM_NAME;

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      "aria-label": ariaLabel,
      children,
      className,
      defaultValue = "",
      disabled = false,
      error,
      fullWidth = false,
      helperText,
      id,
      label,
      onChange,
      onValueChange,
      placeholder = "Select",
      readOnly = false,
      required = false,
      size = "md",
      value,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const labelId = label ? `${selectId}-label` : undefined;
    const helperId = helperText || error ? `${selectId}-helper` : undefined;
    const listboxId = `${selectId}-listbox`;
    const describedBy =
      [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;

    const itemOptions = React.useMemo(
      () => collectOptionsFromChildren(children),
      [children]
    );

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const panelRef = React.useRef<HTMLUListElement | null>(null);
    const typeaheadRef = React.useRef<{
      buffer: string;
      timer: number | null;
    }>({ buffer: "", timer: null });

    const currentValue = isControlled ? value : internalValue;
    const selectedIndex = itemOptions.findIndex(
      (option) => option.value === currentValue
    );
    const selectedOption =
      selectedIndex >= 0 ? itemOptions[selectedIndex] : undefined;
    const hasError = Boolean(error);
    const isInteractive = !disabled && !readOnly;

    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const firstEnabledIndex = React.useCallback(
      () => itemOptions.findIndex((option) => !option.disabled),
      [itemOptions]
    );

    const lastEnabledIndex = React.useCallback(() => {
      for (let index = itemOptions.length - 1; index >= 0; index -= 1) {
        if (!itemOptions[index].disabled) return index;
      }
      return -1;
    }, [itemOptions]);

    const openMenu = React.useCallback(() => {
      if (!isInteractive) return;
      const initialIndex =
        selectedIndex >= 0 && !itemOptions[selectedIndex].disabled
          ? selectedIndex
          : firstEnabledIndex();
      setActiveIndex(initialIndex);
      setOpen(true);
    }, [firstEnabledIndex, isInteractive, itemOptions, selectedIndex]);

    const closeMenu = React.useCallback((restoreFocus = true) => {
      setOpen(false);
      setActiveIndex(-1);
      if (restoreFocus) triggerRef.current?.focus();
    }, []);

    const moveActive = React.useCallback(
      (direction: 1 | -1) => {
        if (itemOptions.length === 0) return;

        let nextIndex = activeIndex;
        for (let step = 0; step < itemOptions.length; step += 1) {
          nextIndex =
            (nextIndex + direction + itemOptions.length) % itemOptions.length;
          if (!itemOptions[nextIndex].disabled) {
            setActiveIndex(nextIndex);
            return;
          }
        }
      },
      [activeIndex, itemOptions]
    );

    const commit = React.useCallback(
      (option: SelectItemData | undefined) => {
        if (!option || option.disabled) return;
        if (!isControlled) setInternalValue(option.value);
        onChange?.(option.value);
        onValueChange?.(option.value);
        closeMenu();
      },
      [closeMenu, isControlled, onChange, onValueChange]
    );

    const matchTypeahead = React.useCallback(
      (key: string) => {
        const state = typeaheadRef.current;
        if (state.timer) window.clearTimeout(state.timer);

        state.buffer += key.toLowerCase();
        const matchIndex = itemOptions.findIndex((option) => {
          const optionText = option.textValue ?? getTextValue(option.label);
          return (
            !option.disabled &&
            optionText.toLowerCase().startsWith(state.buffer)
          );
        });

        if (matchIndex >= 0) setActiveIndex(matchIndex);
        state.timer = window.setTimeout(() => {
          state.buffer = "";
          state.timer = null;
        }, 600);
      },
      [itemOptions]
    );

    const onTriggerKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
      if (!isInteractive) return;

      if (!open) {
        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openMenu();
        }
        return;
      }

      if (event.key === "Escape" || event.key === "Tab") {
        closeMenu(event.key !== "Tab");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveIndex(firstEnabledIndex());
      } else if (event.key === "End") {
        event.preventDefault();
        setActiveIndex(lastEnabledIndex());
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        commit(itemOptions[activeIndex]);
      } else if (event.key.length === 1 && /\S/.test(event.key)) {
        matchTypeahead(event.key);
      }
    };

    React.useEffect(() => {
      if (!open) return undefined;

      const onDocumentMouseDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          !panelRef.current?.contains(target) &&
          !triggerRef.current?.contains(target)
        ) {
          closeMenu(false);
        }
      };

      document.addEventListener("mousedown", onDocumentMouseDown);
      return () =>
        document.removeEventListener("mousedown", onDocumentMouseDown);
    }, [closeMenu, open]);

    const activeOption = open ? itemOptions[activeIndex] : undefined;
    const activeDescendant = activeOption
      ? getOptionId(selectId, activeOption.value)
      : undefined;

    return (
      <div
        ref={setRootRef}
        className={classNames(
          "nova-select",
          `nova-select--${variant}`,
          `nova-select--${size}`,
          fullWidth && "nova-select--full-width",
          open && "nova-select--open",
          hasError && "nova-select--error",
          disabled && "nova-select--disabled",
          readOnly && "nova-select--readonly",
          className
        )}
        {...props}
      >
        {label ? (
          <span className="nova-select__label" id={labelId}>
            {label}
          </span>
        ) : null}

        <div className="nova-select__control-wrap">
          <button
            ref={triggerRef}
            type="button"
            className="nova-select__control"
            aria-activedescendant={activeDescendant}
            aria-controls={open ? listboxId : undefined}
            aria-describedby={describedBy}
            aria-disabled={disabled || undefined}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={hasError || undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-labelledby={labelId}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={() => {
              if (!isInteractive) return;
              if (open) closeMenu();
              else openMenu();
            }}
            onKeyDown={onTriggerKeyDown}
          >
            <span className="nova-select__value">
              {selectedOption ? (
                selectedOption.label
              ) : (
                <span className="nova-select__placeholder">{placeholder}</span>
              )}
            </span>
            <span className="nova-select__indicator" aria-hidden="true">
              <Icon name="keyboard-arrow-down" size={16} />
            </span>
          </button>

          {open ? (
            <ul
              ref={panelRef}
              id={listboxId}
              role="listbox"
              className="nova-select__menu"
              aria-labelledby={labelId}
            >
              {itemOptions.map((option, index) => {
                const isSelected = option.value === currentValue;
                return (
                  <SelectItem
                    as="li"
                    key={option.value}
                    id={getOptionId(selectId, option.value)}
                    role="option"
                    aria-selected={isSelected}
                    active={index === activeIndex}
                    disabled={option.disabled}
                    endIcon={option.endIcon}
                    selected={isSelected}
                    size={size}
                    startIcon={option.startIcon}
                    value={option.value}
                    onClick={() => commit(option)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => {
                      if (!option.disabled) setActiveIndex(index);
                    }}
                  >
                    {option.label}
                  </SelectItem>
                );
              })}
            </ul>
          ) : null}
        </div>

        {helperId ? (
          <p
            id={helperId}
            className={classNames(
              "nova-select__helper",
              hasError && "nova-select__helper--error"
            )}
          >
            {error || helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
