import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import styles from "./Tabs.module.css";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsVariant = "standard" | "scrollable" | "fullWidth";

export type TabsProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Root
> & {
  variant?: TabsVariant;
};

export type TabsListProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> &
  Pick<TabsProps, "variant"> & {
    endScrollButtonDisabled?: boolean;
    onEndScrollButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
    onStartScrollButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
    orientation?: TabsOrientation;
    showScrollButtons?: boolean;
    startScrollButtonDisabled?: boolean;
  };

export type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> & {
  closeLabel?: string;
  /** Shows the fixed close affordance at the end of the tab. */
  closable?: boolean;
  icon?: React.ReactNode;
  onClose?: React.MouseEventHandler<HTMLSpanElement>;
};

export type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
>;

export type TabsScrollButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  direction: "previous" | "next";
};

type TabsContextValue = {
  orientation: TabsOrientation;
  variant: TabsVariant;
};

const TabsContext = React.createContext<TabsContextValue>({
  orientation: "horizontal",
  variant: "standard",
});

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

const tabsClassName = cva(styles.root, {
  defaultVariants: {
    orientation: "horizontal",
  },
  variants: {
    orientation: {
      horizontal: styles.orientationHorizontal,
      vertical: styles.orientationVertical,
    },
  },
});

const tabsListClassName = cva(styles.list, {
  defaultVariants: {
    orientation: "horizontal",
    variant: "standard",
  },
  variants: {
    orientation: {
      horizontal: styles.listHorizontal,
      vertical: styles.listVertical,
    },
    variant: {
      fullWidth: styles.listFullWidth,
      scrollable: styles.listScrollable,
      standard: styles.listStandard,
    },
  },
});

const tabsTriggerClassName = cva(styles.trigger, {
  defaultVariants: {
    hasCloseIcon: false,
    hasIcon: false,
  },
  variants: {
    hasCloseIcon: {
      false: null,
      true: styles.triggerWithCloseIcon,
    },
    hasIcon: {
      false: null,
      true: styles.triggerWithIcon,
    },
  },
});

export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(
  (
    { className, orientation = "horizontal", variant = "standard", ...props },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({ orientation, variant }),
      [orientation, variant]
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <TabsPrimitive.Root
          ref={ref}
          data-orientation={orientation}
          data-slot="tabs"
          data-variant={variant}
          orientation={orientation}
          className={cn(tabsClassName({ orientation }), className)}
          {...props}
        />
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(
  (
    {
      children,
      className,
      endScrollButtonDisabled,
      onEndScrollButtonClick,
      onStartScrollButtonClick,
      orientation: orientationProp,
      showScrollButtons = false,
      startScrollButtonDisabled,
      variant: variantProp,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(TabsContext);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const orientation = orientationProp ?? context.orientation;
    const variant = variantProp ?? context.variant;

    const updateIndicator = React.useCallback(() => {
      const list = listRef.current;
      const activeTrigger = list?.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]'
      );

      if (!list || !activeTrigger) {
        list?.setAttribute("data-indicator-hidden", "true");
        return;
      }

      list.removeAttribute("data-indicator-hidden");

      const offset =
        orientation === "horizontal"
          ? activeTrigger.offsetLeft
          : activeTrigger.offsetTop;
      const size =
        orientation === "horizontal"
          ? activeTrigger.offsetWidth
          : activeTrigger.offsetHeight;

      list.style.setProperty("--nova-tabs-indicator-offset", `${offset}px`);
      list.style.setProperty("--nova-tabs-indicator-size", `${size}px`);
    }, [orientation]);

    React.useLayoutEffect(() => {
      const list = listRef.current;

      if (!list) {
        return undefined;
      }

      updateIndicator();

      const mutationObserver = new MutationObserver(updateIndicator);
      mutationObserver.observe(list, {
        attributes: true,
        attributeFilter: ["data-state"],
        childList: true,
        subtree: true,
      });

      const resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(list);

      list
        .querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')
        .forEach((trigger) => resizeObserver.observe(trigger));

      return () => {
        mutationObserver.disconnect();
        resizeObserver.disconnect();
      };
    }, [children, updateIndicator]);

    const list = (
      <TabsPrimitive.List
        ref={(node) => {
          listRef.current = node;
          assignRef(ref, node);
        }}
        data-slot="tabs-list"
        className={cn(tabsListClassName({ orientation, variant }), className)}
        {...props}
      >
        {children}
        <span
          className={styles.indicator}
          aria-hidden="true"
          role="presentation"
        />
      </TabsPrimitive.List>
    );

    if (!showScrollButtons) {
      return list;
    }

    return (
      <div className={styles.nav}>
        <TabsScrollButton
          direction="previous"
          disabled={startScrollButtonDisabled}
          onClick={onStartScrollButtonClick}
        />
        {list}
        <TabsScrollButton
          direction="next"
          disabled={endScrollButtonDisabled}
          onClick={onEndScrollButtonClick}
        />
      </div>
    );
  }
);

TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    {
      children,
      className,
      closeLabel = "탭 닫기",
      closable = false,
      icon,
      onClick,
      onClose,
      ...props
    },
    ref
  ) => (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      className={cn(
        tabsTriggerClassName({
          hasCloseIcon: closable,
          hasIcon: Boolean(icon),
        }),
        className
      )}
      onClick={(event) => {
        if (event.currentTarget.dataset.state === "active") {
          event.preventDefault();
          return;
        }

        onClick?.(event);
      }}
      {...props}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {closable ? (
        <span
          className={styles.closeIcon}
          role="button"
          aria-label={closeLabel}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClose?.(event);
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <Icon name="close" size="medium" />
        </span>
      ) : null}
    </TabsPrimitive.Trigger>
  )
);

TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn(styles.content, className)}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";

export const TabsScrollButton = React.forwardRef<
  HTMLButtonElement,
  TabsScrollButtonProps
>(({ className, direction, type = "button", ...props }, ref) => {
  const isPrevious = direction === "previous";

  return (
    <button
      ref={ref}
      aria-label={isPrevious ? "이전 탭 보기" : "다음 탭 보기"}
      className={cn(styles.scrollButton, className)}
      type={type}
      {...props}
    >
      <Icon
        name={isPrevious ? "keyboard-arrow-left" : "keyboard-arrow-right"}
        size="medium"
      />
    </button>
  );
});

TabsScrollButton.displayName = "TabsScrollButton";

export type TabsListVariants = VariantProps<typeof tabsListClassName>;
