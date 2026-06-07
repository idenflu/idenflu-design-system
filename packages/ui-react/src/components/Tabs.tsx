import * as React from "react";
import { classNames } from "../utils/classNames";

export type TabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type TabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  tabs: TabItem[];
  /** Accessible name for the tablist. */
  label: string;
  /** Selected tab value (controlled). */
  value?: string;
  /** Initial selected value (uncontrolled). Defaults to the first enabled tab. */
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, label, onChange, tabs, value, ...props }, ref) => {
    const base = React.useId();
    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const isControlled = value !== undefined;
    const firstEnabled = tabs.find((tab) => !tab.disabled)?.value;
    const [internal, setInternal] = React.useState(defaultValue ?? firstEnabled);
    const current = isControlled ? value : internal;

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const activate = (index: number) => {
      const tab = tabs[index];
      if (!tab || tab.disabled) return;
      select(tab.value);
      tabRefs.current[index]?.focus();
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const count = tabs.length;
      const step = (dir: 1 | -1) => {
        for (let i = 1; i <= count; i += 1) {
          const next = ((index + dir * i) % count + count) % count;
          if (!tabs[next].disabled) return next;
        }
        return index;
      };
      let target: number | null = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") target = step(1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = step(-1);
      else if (event.key === "Home") target = tabs.findIndex((tab) => !tab.disabled);
      else if (event.key === "End") {
        for (let i = count - 1; i >= 0; i -= 1) {
          if (!tabs[i].disabled) {
            target = i;
            break;
          }
        }
      }
      if (target !== null && target >= 0) {
        event.preventDefault();
        activate(target);
      }
    };

    const currentTab = tabs.find((tab) => tab.value === current) ?? tabs.find((tab) => !tab.disabled);
    const currentValue = currentTab?.value;

    return (
      <div ref={ref} className={classNames("if-tabs", className)} {...props}>
        <div role="tablist" aria-label={label} className="if-tabs__list">
          {tabs.map((tab, index) => {
            const selected = tab.value === currentValue;
            return (
              <button
                key={tab.value}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${tab.value}`}
                aria-selected={selected}
                aria-controls={`${base}-panel-${tab.value}`}
                tabIndex={selected ? 0 : -1}
                disabled={tab.disabled}
                className={classNames("if-tabs__tab", selected && "is-selected")}
                onClick={() => select(tab.value)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                {tab.icon != null ? (
                  <span className="if-tabs__icon" aria-hidden="true">
                    {tab.icon}
                  </span>
                ) : null}
                <span className="if-tabs__label">{tab.label}</span>
              </button>
            );
          })}
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.value}
            role="tabpanel"
            id={`${base}-panel-${tab.value}`}
            aria-labelledby={`${base}-tab-${tab.value}`}
            tabIndex={0}
            hidden={tab.value !== currentValue}
            className="if-tabs__panel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";
