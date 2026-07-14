import { Tooltip as TooltipPrimitive } from "radix-ui";
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
  /** Delay before the tooltip opens on hover or focus, in milliseconds. */
  delay?: number;
  /** Delay before the tooltip opens on hover or focus, in milliseconds. */
  enterDelayMs?: number;
  /** Delay before the tooltip closes after hover or focus leaves, in milliseconds. */
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
  delay = 500,
  enterDelayMs,
  leaveDelayMs = 0,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipProps) {
  const closeTimerRef = React.useRef<number | undefined>(undefined);
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false
  );
  const isOpen = open ?? uncontrolledOpen;

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

      if (leaveDelayMs <= 0) {
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
    <TooltipPrimitive.Root
      delayDuration={enterDelayMs ?? delay}
      open={isOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      {children}
    </TooltipPrimitive.Root>
  );
}

Tooltip.displayName = "Tooltip";

export const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  TooltipTriggerProps
>(({ children, ...props }, ref) => (
  <TooltipPrimitive.Trigger ref={ref} data-slot="tooltip-trigger" {...props}>
    {children}
  </TooltipPrimitive.Trigger>
));

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
      ...props
    },
    ref
  ) => {
    const { align, side } = getPosition(position);
    const contentStyle: TooltipStyle = {
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

export const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
};

TooltipProvider.displayName = "TooltipProvider";
