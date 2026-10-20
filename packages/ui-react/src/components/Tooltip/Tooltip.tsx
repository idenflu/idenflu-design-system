import { Slot, Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../../utils/classNames";
import styles from "./Tooltip.module.css";

export type TooltipPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

export type TooltipTransition = {
  /** Enter animation duration in milliseconds. Defaults to 140. */
  enter?: number;
  /** Exit animation duration in milliseconds. Defaults to 100. */
  out?: number;
};

type TooltipRootProps = Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
  "delayDuration"
>;

export type TooltipProps = TooltipRootProps & {
  /** Hover delay in milliseconds. Inherits the Provider; keyboard focus opens immediately. */
  enterDelayMs?: number;
  /** Pointer-leave delay only. Escape, blur and activation close immediately. */
  leaveDelayMs?: number;
};

type TooltipSide = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
>["side"];

type TooltipAlign = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
>["align"];

type TooltipStyle = React.CSSProperties & {
  "--nova-tooltip-enter-duration"?: string;
  "--nova-tooltip-out-duration"?: string;
};

export type TooltipTriggerProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Trigger
>;

type TooltipContentPrimitiveProps = Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  "align" | "side" | "sideOffset"
>;

export type TooltipContentProps = TooltipContentPrimitiveProps & {
  /** Adds an arrow pointing toward the trigger. Defaults to false. */
  arrow?: boolean;
  /** Tooltip position relative to the trigger. Defaults to "top". */
  position?: TooltipPosition;
  /** Distance between the trigger and tooltip content. */
  offset?: number;
  /** Enter and exit animation durations in milliseconds. */
  transition?: TooltipTransition;
};

function getPosition(position: TooltipPosition): {
  align: TooltipAlign;
  side: TooltipSide;
} {
  const [side, align = "center"] = position.split("-") as [
    TooltipSide,
    TooltipAlign?,
  ];

  return { align, side };
}

export function Tooltip({
  children,
  enterDelayMs,
  leaveDelayMs = 0,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipProps) {
  const provider = React.useContext(TooltipDelayContext);
  const focusRef = React.useRef(false);
  const pointerCloseRef = React.useRef(false);
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const closeTimerRef = React.useRef<number | undefined>(undefined);
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  );
  const isOpen = open ?? uncontrolledOpen;
  const previousOpen = React.useRef(isOpen);

  React.useEffect(() => {
    if (previousOpen.current && !isOpen) provider?.onClose();
    previousOpen.current = isOpen;
  }, [isOpen, provider?.onClose]);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current !== undefined) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      clearCloseTimer();

      if (nextOpen) {
        setOpen(true);
        return;
      }

      if (pointerCloseRef.current && focusRef.current) return;

      if (!pointerCloseRef.current || leaveDelayMs <= 0) {
        setOpen(false);
        return;
      }

      closeTimerRef.current = window.setTimeout(() => {
        setOpen(false);
      }, leaveDelayMs);
    },
    [clearCloseTimer, leaveDelayMs, setOpen]
  );

  React.useEffect(() => clearCloseTimer, [clearCloseTimer]);

  return (
    <TooltipBehaviorContext.Provider
      value={{
        clearCloseTimer,
        focusRef,
        pointerCloseRef,
        trigger,
        setTrigger,
      }}
    >
      <TooltipPrimitive.Root
        delayDuration={
          provider && Date.now() < provider.skipUntil
            ? 0
            : (enterDelayMs ?? 500)
        }
        open={isOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipBehaviorContext.Provider>
  );
}

Tooltip.displayName = "Tooltip";

type TooltipBehavior = {
  clearCloseTimer: () => void;
  focusRef: React.MutableRefObject<boolean>;
  pointerCloseRef: React.MutableRefObject<boolean>;
  trigger: HTMLButtonElement | null;
  setTrigger: (element: HTMLButtonElement | null) => void;
};

const TooltipBehaviorContext = React.createContext<TooltipBehavior | null>(
  null
);

// Receive Radix's generated description before merging the consumer's IDs.
const TriggerElement = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    existingDescription?: string;
  }
>(
  (
    {
      asChild,
      existingDescription,
      children,
      "aria-describedby": description,
      ...props
    },
    ref
  ) => {
    const child = asChild
      ? (React.Children.only(children) as React.ReactElement<
          React.HTMLAttributes<HTMLElement>
        >)
      : null;
    const describedBy =
      [
        ...new Set(
          [existingDescription, child?.props["aria-describedby"], description]
            .filter(Boolean)
            .join(" ")
            .split(/\s+/)
            .filter(Boolean)
        ),
      ].join(" ") || undefined;

    if (child) {
      return (
        <Slot.Root {...props} ref={ref} aria-describedby={describedBy}>
          {React.cloneElement(child, { "aria-describedby": describedBy })}
        </Slot.Root>
      );
    }
    return (
      <button {...props} ref={ref} aria-describedby={describedBy}>
        {children}
      </button>
    );
  }
);
TriggerElement.displayName = "TooltipTriggerElement";

export const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  TooltipTriggerProps
>(
  (
    {
      children,
      asChild,
      "aria-describedby": existingDescription,
      onFocus,
      onBlur,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onClick,
      ...props
    },
    ref
  ) => {
    const behavior = React.useContext(TooltipBehaviorContext);
    const setRef = React.useCallback(
      (element: HTMLButtonElement | null) => {
        behavior?.setTrigger(element);
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
      },
      [behavior?.setTrigger, ref]
    );
    return (
      <TooltipPrimitive.Trigger
        {...props}
        ref={setRef}
        asChild
        data-slot="tooltip-trigger"
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented && behavior) {
            behavior.focusRef.current =
              event.currentTarget.matches(":focus-visible");
            behavior.pointerCloseRef.current = false;
            behavior.clearCloseTimer();
          }
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!event.defaultPrevented && behavior) {
            behavior.focusRef.current = false;
            behavior.pointerCloseRef.current = false;
          }
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (
            !event.defaultPrevented &&
            event.pointerType !== "touch" &&
            behavior
          ) {
            behavior.clearCloseTimer();
            behavior.pointerCloseRef.current = false;
          }
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          if (!event.defaultPrevented && behavior)
            behavior.pointerCloseRef.current = true;
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (!event.defaultPrevented && behavior)
            behavior.pointerCloseRef.current = false;
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && behavior)
            behavior.pointerCloseRef.current = false;
        }}
      >
        <TriggerElement
          asChild={asChild}
          existingDescription={existingDescription}
        >
          {children}
        </TriggerElement>
      </TooltipPrimitive.Trigger>
    );
  }
);

TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      arrow = false,
      children,
      className,
      offset = 8,
      position = "top",
      style,
      transition,
      onEscapeKeyDown,
      onPointerDownOutside,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref
  ) => {
    const behavior = React.useContext(TooltipBehaviorContext);
    const [themeStyle, setThemeStyle] = React.useState<React.CSSProperties>({});
    React.useLayoutEffect(() => {
      const trigger = behavior?.trigger;
      if (!trigger) return;
      const updateTheme = () => {
        const computed = getComputedStyle(trigger);
        const dark = Boolean(trigger.closest(".dark"));
        setThemeStyle({
          "--nova-tooltip-background": computed.getPropertyValue(
            dark ? "--background-neutral-strong" : "--background-neutral"
          ),
          "--nova-tooltip-color": computed.getPropertyValue("--text-on-color"),
          "--rounded-md": computed.getPropertyValue("--rounded-md"),
          "--caption-md": computed.getPropertyValue("--caption-md"),
        } as React.CSSProperties);
      };
      updateTheme();
      // Portals must retain local theme values, including live theme changes.
      const observer = new MutationObserver(updateTheme);
      for (
        let element: HTMLElement | null = trigger;
        element;
        element = element.parentElement
      ) {
        observer.observe(element, {
          attributes: true,
          attributeFilter: ["class", "style"],
        });
      }
      return () => observer.disconnect();
    }, [behavior?.trigger]);
    const { align, side } = getPosition(position);
    const contentStyle: TooltipStyle = {
      ...themeStyle,
      "--nova-tooltip-enter-duration": `${transition?.enter ?? 140}ms`,
      "--nova-tooltip-out-duration": `${transition?.out ?? 100}ms`,
      ...style,
    };

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          align={align}
          className={cn(styles.content, className)}
          data-slot="tooltip-content"
          side={side}
          sideOffset={offset}
          style={contentStyle}
          {...props}
          onEscapeKeyDown={(event) => {
            onEscapeKeyDown?.(event);
            if (!event.defaultPrevented && behavior)
              behavior.pointerCloseRef.current = false;
          }}
          onPointerDownOutside={(event) => {
            onPointerDownOutside?.(event);
            if (!event.defaultPrevented && behavior)
              behavior.pointerCloseRef.current = false;
          }}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            if (!event.defaultPrevented && behavior) {
              behavior.clearCloseTimer();
              behavior.pointerCloseRef.current = false;
            }
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            if (!event.defaultPrevented && behavior)
              behavior.pointerCloseRef.current = true;
          }}
        >
          {children}
          {arrow ? (
            <TooltipPrimitive.Arrow
              className={styles.arrow}
              data-slot="tooltip-arrow"
            />
          ) : null}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  }
);

TooltipContent.displayName = "TooltipContent";

export type TooltipProviderProps = React.ComponentProps<
  typeof TooltipPrimitive.Provider
> & {
  /** Default hover delay. Defaults to 500ms. */
  enterDelayMs?: number;
  /** Skip hover delay when moving between tooltips within this window. Defaults to 300ms. */
  skipDelayMs?: number;
};

const TooltipDelayContext = React.createContext<{
  skipUntil: number;
  onClose: () => void;
} | null>(null);

export const TooltipProvider = ({
  enterDelayMs,
  skipDelayMs,
  delayDuration,
  skipDelayDuration,
  ...props
}: TooltipProviderProps) => {
  const skipDelay = skipDelayMs ?? skipDelayDuration ?? 300;
  const [skipUntil, setSkipUntil] = React.useState(0);
  React.useEffect(() => {
    if (!skipUntil) return;
    const timer = window.setTimeout(
      () => setSkipUntil(0),
      Math.max(0, skipUntil - Date.now())
    );
    return () => window.clearTimeout(timer);
  }, [skipUntil]);
  // Radix starts its window on a close request; leaveDelayMs postpones the actual close.
  const onClose = React.useCallback(
    () => setSkipUntil(Date.now() + skipDelay),
    [skipDelay]
  );
  return (
    <TooltipDelayContext.Provider value={{ skipUntil, onClose }}>
      <TooltipPrimitive.Provider
        {...props}
        delayDuration={enterDelayMs ?? delayDuration ?? 500}
        skipDelayDuration={skipDelay}
      />
    </TooltipDelayContext.Provider>
  );
};

TooltipProvider.displayName = "TooltipProvider";
