import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
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
    /** Omit to derive the disabled state from the scroll boundary. */
    endScrollButtonDisabled?: boolean;
    /** Overrides the built-in next-page scroll when provided. */
    onEndScrollButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
    /** Overrides the built-in previous-page scroll when provided. */
    onStartScrollButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
    orientation?: TabsOrientation;
    showScrollButtons?: boolean;
    /** Omit to derive the disabled state from the scroll boundary. */
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
  "children" | "color"
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
    return "instant";
  }

  return "smooth";
}

function scrollTabToEdge(
  tab: HTMLElement,
  scroller: HTMLElement,
  orientation: TabsOrientation,
  behavior = getScrollBehavior(),
) {
  const scrollerRect = scroller.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();

  if (orientation === "horizontal") {
    if (
      tabRect.left <= scrollerRect.left &&
      tabRect.right >= scrollerRect.right
    )
      return;
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

  if (tabRect.top <= scrollerRect.top && tabRect.bottom >= scrollerRect.bottom)
    return;
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
    ref,
  ) => {
    const contextValue = React.useMemo(
      () => ({ orientation, variant }),
      [orientation, variant],
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
  },
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
    ref,
  ) => {
    const context = React.useContext(TabsContext);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const navRef = React.useRef<HTMLDivElement | null>(null);
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const activeTriggerRef = React.useRef<HTMLElement | null>(null);
    const geometryRef = React.useRef<string | null>(null);
    const [scrollBounds, setScrollBounds] = React.useState({
      start: false,
      end: false,
    });
    const scrollBoundsRef = React.useRef(scrollBounds);
    const orientation = orientationProp ?? context.orientation;
    const variant = variantProp ?? context.variant;

    const getScrollContainer = React.useCallback(
      () => scrollerRef.current ?? listRef.current,
      [],
    );

    const updateScrollBounds = React.useCallback(() => {
      const scroller = getScrollContainer();
      if (!scroller) return;
      const horizontal = orientation === "horizontal";
      const rtl = horizontal && getComputedStyle(scroller).direction === "rtl";
      const position = horizontal
        ? scroller.scrollLeft * (rtl ? -1 : 1)
        : scroller.scrollTop;
      const max = horizontal
        ? scroller.scrollWidth - scroller.clientWidth
        : scroller.scrollHeight - scroller.clientHeight;
      const start = position > 1;
      const end = position < max - 1;
      if (
        scrollBoundsRef.current.start !== start ||
        scrollBoundsRef.current.end !== end
      ) {
        scrollBoundsRef.current = { start, end };
        setScrollBounds(scrollBoundsRef.current);
      }
    }, [getScrollContainer, orientation]);

    const scrollPage = (direction: "previous" | "next") => {
      const scroller = getScrollContainer();
      if (!scroller) return;
      const horizontal = orientation === "horizontal";
      const rtl = horizontal && getComputedStyle(scroller).direction === "rtl";
      const distance =
        (horizontal ? scroller.clientWidth : scroller.clientHeight) * 0.75;
      const delta = distance * (direction === "previous" ? -1 : 1);
      scroller.scrollBy({
        behavior: getScrollBehavior(),
        ...(horizontal ? { left: delta * (rtl ? -1 : 1) } : { top: delta }),
      });
    };

    const scrollTabIntoView = React.useCallback(
      (tab: HTMLElement) => {
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) {
          return;
        }

        scrollTabToEdge(tab, scrollContainer, orientation);
      },
      [getScrollContainer, orientation],
    );

    const scrollContextValue = React.useMemo(
      () => ({ scrollTabIntoView }),
      [scrollTabIntoView],
    );

    const updateIndicator = React.useCallback(() => {
      const list = listRef.current;
      const nav = navRef.current;
      const activeTrigger = list?.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]',
      );

      if (!list || !nav || !activeTrigger) {
        nav?.setAttribute("data-indicator-hidden", "true");
        return;
      }

      const hostRect = nav.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();
      const clipRect = scrollerRef.current?.getBoundingClientRect() ?? hostRect;

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

    const syncLayout = React.useCallback(() => {
      const list = listRef.current;
      const scroller = getScrollContainer();
      if (!list || !scroller) return;
      const activeTrigger = list.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"]',
      );
      const triggers = list.querySelectorAll<HTMLElement>(
        '[data-slot="tabs-trigger"]',
      );
      const geometry = [
        orientation,
        getComputedStyle(scroller).direction,
        scroller.clientWidth,
        scroller.clientHeight,
        scroller.scrollWidth,
        scroller.scrollHeight,
        ...Array.from(
          triggers,
          (tab) =>
            `${tab.offsetLeft},${tab.offsetTop},${tab.offsetWidth},${tab.offsetHeight}`,
        ),
      ].join(";");
      const selectionChanged = activeTrigger !== activeTriggerRef.current;
      const geometryChanged =
        geometryRef.current !== null && geometry !== geometryRef.current;
      if (activeTrigger && (selectionChanged || geometryChanged)) {
        // Restore immediately; animate subsequent selections. Scroll events never realign the selection.
        const behavior =
          selectionChanged && activeTriggerRef.current !== null
            ? getScrollBehavior()
            : "instant";
        scrollTabToEdge(activeTrigger, scroller, orientation, behavior);
      }
      activeTriggerRef.current = activeTrigger;
      geometryRef.current = geometry;
      updateScrollBounds();
      updateIndicator();
    }, [getScrollContainer, orientation, updateScrollBounds, updateIndicator]);

    React.useLayoutEffect(() => {
      syncLayout();
    });

    React.useLayoutEffect(() => {
      const list = listRef.current;
      const scroller = getScrollContainer();
      if (!list || !scroller) return;

      const resizeObserver = new ResizeObserver(() => syncLayout());
      const observeLayout = () => {
        resizeObserver.disconnect();
        resizeObserver.observe(list);
        resizeObserver.observe(scroller);
        if (navRef.current) resizeObserver.observe(navRef.current);
        list
          .querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')
          .forEach((trigger) => resizeObserver.observe(trigger));
      };
      observeLayout();
      const mutationObserver = new MutationObserver((records) => {
        if (records.some((record) => record.type === "childList"))
          observeLayout();
        syncLayout();
      });
      mutationObserver.observe(list, {
        attributes: true,
        attributeFilter: ["data-state"],
        characterData: true,
        childList: true,
        subtree: true,
      });
      const handleScroll = () => {
        updateScrollBounds();
        updateIndicator();
      };
      scroller.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        mutationObserver.disconnect();
        resizeObserver.disconnect();
        scroller.removeEventListener("scroll", handleScroll);
      };
    }, [
      getScrollContainer,
      showScrollButtons,
      variant,
      syncLayout,
      updateScrollBounds,
      updateIndicator,
    ]);

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
            (showScrollButtons ||
              variant === "fullWidth" ||
              variant === "scrollable") &&
              styles.navFill,
            className,
          )}
          data-orientation={orientation}
          data-slot="tabs-nav"
        >
          {showScrollButtons ? (
            <>
              <TabsScrollButton
                direction="previous"
                disabled={startScrollButtonDisabled ?? !scrollBounds.start}
                onClick={
                  onStartScrollButtonClick ?? (() => scrollPage("previous"))
                }
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
                disabled={endScrollButtonDisabled ?? !scrollBounds.end}
                onClick={onEndScrollButtonClick ?? (() => scrollPage("next"))}
              />
            </>
          ) : variant === "scrollable" ? (
            <div
              ref={scrollerRef}
              className={styles.scroller}
              data-slot="tabs-scroller"
            >
              {list}
            </div>
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
  },
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
    ref,
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
          className,
        )}
        {...props}
        onClick={(event) => {
          if (event.currentTarget.dataset.state === "active") {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
        onFocus={(event) => {
          props.onFocus?.(event);
          if (!event.defaultPrevented) {
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
  },
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
    <IconButton
      ref={ref}
      type={type}
      {...props}
      className={cn(styles.scrollButton, className)}
      color="neutral"
      icon={
        <Icon
          name={isPrevious ? "keyboard-arrow-left" : "keyboard-arrow-right"}
          size="medium"
        />
      }
      label={isPrevious ? "이전 탭 보기" : "다음 탭 보기"}
      size="md"
      variant="ghost"
    />
  );
});

TabsScrollButton.displayName = "TabsScrollButton";

export type TabsListVariants = VariantProps<typeof tabsListClassName>;
