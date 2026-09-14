import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../../utils/classNames";
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

function getScrollBehavior(): ScrollBehavior {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "auto";
  }

  return "smooth";
}

function scrollTabToEdge(
  tab: HTMLElement,
  scroller: HTMLElement,
  orientation: TabsOrientation
) {
  const scrollerRect = scroller.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  const behavior = getScrollBehavior();

  if (orientation === "horizontal") {
    if (tabRect.left < scrollerRect.left - 1) {
      scroller.scrollTo({
        behavior,
        left: scroller.scrollLeft + (tabRect.left - scrollerRect.left),
      });
      return;
    }

    if (tabRect.right > scrollerRect.right + 1) {
      scroller.scrollTo({
        behavior,
        left: scroller.scrollLeft + (tabRect.right - scrollerRect.right),
      });
    }

    return;
  }

  if (tabRect.top < scrollerRect.top - 1) {
    scroller.scrollTo({
      behavior,
      top: scroller.scrollTop + (tabRect.top - scrollerRect.top),
    });
    return;
  }

  if (tabRect.bottom > scrollerRect.bottom + 1) {
    scroller.scrollTo({
      behavior,
      top: scroller.scrollTop + (tabRect.bottom - scrollerRect.bottom),
    });
  }
}

type TabsListScrollContextValue = {
  scrollTabIntoView: (tab: HTMLElement) => void;
};

const TabsListScrollContext =
  React.createContext<TabsListScrollContextValue | null>(null);

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
  React.ComponentRef<typeof TabsPrimitive.Root>,
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
  React.ComponentRef<typeof TabsPrimitive.List>,
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
    const navRef = React.useRef<HTMLDivElement | null>(null);
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const activeTriggerRef = React.useRef<HTMLElement | null>(null);
    const orientation = orientationProp ?? context.orientation;
    const variant = variantProp ?? context.variant;

    const getScrollContainer = React.useCallback(() => {
      if (scrollerRef.current) {
        return scrollerRef.current;
      }

      const list = listRef.current;
      if (!list) {
        return null;
      }

      const canScroll =
        orientation === "horizontal"
          ? list.scrollWidth > list.clientWidth + 1
          : list.scrollHeight > list.clientHeight + 1;

      return canScroll ? list : null;
    }, [orientation]);

    const scrollTabIntoView = React.useCallback(
      (tab: HTMLElement) => {
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) {
          return;
        }

        scrollTabToEdge(tab, scrollContainer, orientation);
      },
      [getScrollContainer, orientation]
    );

    const scrollContextValue = React.useMemo(
      () => ({ scrollTabIntoView }),
      [scrollTabIntoView]
    );

    const updateIndicator = React.useCallback(() => {
      const list = listRef.current;
      const nav = navRef.current;
      const activeTrigger = list?.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]'
      );

      if (!list || !nav || !activeTrigger) {
        nav?.setAttribute("data-indicator-hidden", "true");
        return;
      }

      const hostRect = nav.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();
      const clipRect =
        scrollerRef.current?.getBoundingClientRect() ?? hostRect;

      let offset: number;
      let size: number;

      if (orientation === "horizontal") {
        const start = Math.max(triggerRect.left, clipRect.left);
        const end = Math.min(triggerRect.right, clipRect.right);

        if (end <= start) {
          nav.setAttribute("data-indicator-hidden", "true");
          return;
        }

        offset = start - hostRect.left;
        size = end - start;
      } else {
        const start = Math.max(triggerRect.top, clipRect.top);
        const end = Math.min(triggerRect.bottom, clipRect.bottom);

        if (end <= start) {
          nav.setAttribute("data-indicator-hidden", "true");
          return;
        }

        offset = start - hostRect.top;
        size = end - start;
      }

      nav.removeAttribute("data-indicator-hidden");
      nav.style.setProperty("--nova-tabs-indicator-offset", `${offset}px`);
      nav.style.setProperty("--nova-tabs-indicator-size", `${size}px`);
    }, [orientation]);

    React.useLayoutEffect(() => {
      const list = listRef.current;
      const activeTrigger =
        list?.querySelector<HTMLElement>(
          '[data-slot="tabs-trigger"][data-state="active"]'
        ) ?? null;

      if (activeTrigger && activeTrigger !== activeTriggerRef.current) {
        const shouldScroll = activeTriggerRef.current !== null;
        activeTriggerRef.current = activeTrigger;

        if (shouldScroll) {
          scrollTabIntoView(activeTrigger);
        }
      }

      updateIndicator();
    });

    React.useLayoutEffect(() => {
      const list = listRef.current;

      if (!list) {
        return undefined;
      }

      const mutationObserver = new MutationObserver(updateIndicator);
      mutationObserver.observe(list, {
        attributes: true,
        attributeFilter: ["data-state"],
        childList: true,
        subtree: true,
      });

      const resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(list);
      if (navRef.current) {
        resizeObserver.observe(navRef.current);
      }
      if (scrollerRef.current) {
        resizeObserver.observe(scrollerRef.current);
      }

      list
        .querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')
        .forEach((trigger) => resizeObserver.observe(trigger));

      const scroller = scrollerRef.current;
      const handleScroll = () => updateIndicator();
      scroller?.addEventListener("scroll", handleScroll, { passive: true });
      list.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        mutationObserver.disconnect();
        resizeObserver.disconnect();
        scroller?.removeEventListener("scroll", handleScroll);
        list.removeEventListener("scroll", handleScroll);
      };
    }, [children, showScrollButtons, updateIndicator]);

    const list = (
      <TabsPrimitive.List
        ref={(node) => {
          listRef.current = node;
          assignRef(ref, node);
        }}
        data-slot="tabs-list"
        className={tabsListClassName({ orientation, variant })}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    );

    return (
      <TabsListScrollContext.Provider value={scrollContextValue}>
        <div
          ref={navRef}
          className={cn(
            styles.nav,
            (showScrollButtons || variant === "fullWidth") && styles.navFill,
            className
          )}
          data-orientation={orientation}
          data-slot="tabs-nav"
        >
          {showScrollButtons ? (
            <>
              <TabsScrollButton
                direction="previous"
                disabled={startScrollButtonDisabled}
                onClick={onStartScrollButtonClick}
              />
              <div
                ref={scrollerRef}
                className={styles.scroller}
                data-slot="tabs-scroller"
              >
                {list}
              </div>
              <TabsScrollButton
                direction="next"
                disabled={endScrollButtonDisabled}
                onClick={onEndScrollButtonClick}
              />
            </>
          ) : (
            list
          )}
          <span
            className={styles.indicator}
            aria-hidden="true"
            role="presentation"
          />
        </div>
      </TabsListScrollContext.Provider>
    );
  }
);

TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
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
  ) => {
    const scrollContext = React.useContext(TabsListScrollContext);

    return (
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
        {...props}
        onClick={(event) => {
          if (event.currentTarget.dataset.state === "active") {
            event.preventDefault();
            return;
          }

          const tab = event.currentTarget;
          onClick?.(event);

          // Wait for controlled selection + layout, then align to the clipped edge.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              scrollContext?.scrollTabIntoView(tab);
            });
          });
        }}
        onFocus={(event) => {
          props.onFocus?.(event);
          if (event.currentTarget.dataset.state === "active") {
            scrollContext?.scrollTabIntoView(event.currentTarget);
          }
        }}
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
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
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
