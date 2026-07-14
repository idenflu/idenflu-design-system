import * as React from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/classNames";
import { lockBodyScroll } from "../../utils/lockBodyScroll";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";
import styles from "./Drawer.module.css";

export type DrawerSide = "bottom" | "left" | "right" | "top";
export type DrawerSize = "lg" | "md" | "sm";

export type DrawerTransition = {
  /** Enter animation duration in milliseconds. Defaults to 200. */
  enter?: number;
  /** Exit animation duration in milliseconds. Defaults to 160. */
  out?: number;
};

type DrawerContextValue = {
  descriptionId: string;
  descriptionPresent: boolean;
  onClose: () => void;
  open: boolean;
  setDescriptionPresent: (present: boolean) => void;
  setOpen: (open: boolean) => void;
  setTitlePresent: (present: boolean) => void;
  side: DrawerSide;
  size: DrawerSize;
  titleId: string;
  titlePresent: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
};

type DrawerStyle = React.CSSProperties & {
  "--nova-drawer-enter-duration"?: string;
  "--nova-drawer-out-duration"?: string;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

const contentClassName = cva(styles.content, {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

function useDrawerContext(component: string) {
  const context = React.useContext(DrawerContext);

  if (!context) {
    throw new Error(`${component} must be used within Drawer.`);
  }

  return context;
}

function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

function getTabbableElements(container: HTMLElement) {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex !== -1
  );
}

function getInitialFocusTarget(surface: HTMLElement) {
  const tabbables = getTabbableElements(surface).filter(
    (element) => element.dataset.slot !== "drawer-close"
  );
  const field = tabbables.find((element) =>
    element.matches("input, textarea, select")
  );

  return field ?? tabbables[0] ?? getTabbableElements(surface)[0] ?? null;
}

function usePresence(open: boolean, duration: number) {
  const [mounted, setMounted] = React.useState(open);
  const [state, setState] = React.useState<"open" | "closed">(
    open ? "open" : "closed"
  );

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => setState("open"));
      return () => window.cancelAnimationFrame(frame);
    }

    if (!mounted) {
      return undefined;
    }

    setState("closed");
    const timer = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration, mounted, open]);

  return { mounted, state };
}

export type DrawerProps = {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  /** Callback fired when the drawer requests to close. */
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** Edge from which the drawer panel slides in. */
  side: DrawerSide;
  /** Panel width preset for left/right drawers. Defaults to `md`. */
  size?: DrawerSize;
};

export const Drawer = ({
  children,
  defaultOpen = false,
  onClose,
  onOpenChange,
  open,
  side,
  size = "md",
}: DrawerProps) => {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const [titlePresent, setTitlePresent] = React.useState(false);
  const [descriptionPresent, setDescriptionPresent] = React.useState(false);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);

      if (!nextOpen) {
        onClose();
      }
    },
    [isControlled, onClose, onOpenChange]
  );

  const contextValue = React.useMemo<DrawerContextValue>(
    () => ({
      descriptionId,
      descriptionPresent,
      onClose,
      open: isOpen,
      setDescriptionPresent,
      setOpen,
      setTitlePresent,
      side,
      size,
      titleId,
      titlePresent,
      triggerRef,
    }),
    [
      descriptionId,
      descriptionPresent,
      isOpen,
      onClose,
      setOpen,
      side,
      size,
      titleId,
      titlePresent,
    ]
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <div data-slot="drawer">{children}</div>
    </DrawerContext.Provider>
  );
};

Drawer.displayName = "Drawer";

export type DrawerTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

export const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  DrawerTriggerProps
>(({ asChild = false, children, onClick, type = "button", ...props }, ref) => {
  const { setOpen, triggerRef } = useDrawerContext("DrawerTrigger");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      setOpen(true);
    }
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler;
      ref?: React.Ref<HTMLElement>;
    }>;

    return React.cloneElement(child, {
      ...(props as Partial<typeof child.props>),
      "data-slot": "drawer-trigger",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(event);
        handleClick(event);
      },
      ref: composeRefs(ref, triggerRef, child.props.ref),
    } as Partial<typeof child.props>);
  }

  return (
    <button
      ref={composeRefs(ref, triggerRef)}
      data-slot="drawer-trigger"
      onClick={handleClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});

DrawerTrigger.displayName = "DrawerTrigger";

export type DrawerPortalProps = {
  children?: React.ReactNode;
  container?: HTMLElement | null;
  /** When `false`, nothing is portaled. Used for exit animations. */
  mounted?: boolean;
};

export const DrawerPortal = ({
  children,
  container,
  mounted = true,
}: DrawerPortalProps) => {
  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, container ?? document.body);
};

DrawerPortal.displayName = "DrawerPortal";

export type DrawerOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  transition?: DrawerTransition;
};

export const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  DrawerOverlayProps
>(({ className, style, transition, ...props }, ref) => {
  const overlayStyle: DrawerStyle = {
    "--nova-drawer-enter-duration": `${transition?.enter ?? 200}ms`,
    "--nova-drawer-out-duration": `${transition?.out ?? 160}ms`,
    ...style,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(styles.overlay, className)}
      data-slot="drawer-overlay"
      style={overlayStyle}
      {...props}
    />
  );
});

DrawerOverlay.displayName = "DrawerOverlay";

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Portal mount target. Defaults to `document.body`. */
  container?: HTMLElement | null;
  /** When `false`, clicking the backdrop does not close the drawer. */
  dismissOnBackdrop?: boolean;
  /** When `false`, pressing Escape does not close the drawer. */
  dismissOnEscape?: boolean;
  onBackdropClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Renders `DrawerClose` in the top-end corner. Defaults to `true`. */
  showClose?: boolean;
  /** Edge override for this content instance. */
  side?: DrawerSide;
  /** Panel width override for left/right drawers. */
  size?: DrawerSize;
  /** Enter and exit animation durations in milliseconds. */
  transition?: DrawerTransition;
};

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(
  (
    {
      "aria-describedby": ariaDescribedbyProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledbyProp,
      children,
      className,
      container,
      dismissOnBackdrop = true,
      dismissOnEscape = true,
      onBackdropClick,
      onEscapeKeyDown,
      showClose = true,
      side: sideProp,
      size: sizeProp,
      style,
      transition,
      ...props
    },
    ref
  ) => {
    const {
      descriptionId,
      descriptionPresent,
      open,
      setOpen,
      side: contextSide,
      size: contextSize,
      titleId,
      titlePresent,
    } = useDrawerContext("DrawerContent");
    const side = sideProp ?? contextSide;
    const size = sizeProp ?? contextSize;
    const outDuration = transition?.out ?? 160;
    const { mounted, state } = usePresence(open, outDuration);
    const surfaceRef = React.useRef<HTMLDivElement | null>(null);
    const restoreFocusRef = React.useRef<HTMLElement | null>(null);

    const setSurfaceRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        surfaceRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const contentStyle: DrawerStyle = {
      "--nova-drawer-enter-duration": `${transition?.enter ?? 200}ms`,
      "--nova-drawer-out-duration": `${outDuration}ms`,
      ...style,
    };

    const labelledby =
      ariaLabelledbyProp ?? (titlePresent ? titleId : undefined);
    const describedby =
      ariaDescribedbyProp ?? (descriptionPresent ? descriptionId : undefined);

    const requestClose = React.useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onBackdropClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (dismissOnBackdrop && event.target === event.currentTarget) {
        requestClose();
      }
    };

    React.useLayoutEffect(() => {
      if (!mounted || !open) {
        return undefined;
      }

      restoreFocusRef.current = document.activeElement as HTMLElement | null;

      const surface = surfaceRef.current;
      if (!surface) {
        return undefined;
      }

      const target = getInitialFocusTarget(surface);
      if (target) {
        target.focus();
      } else {
        surface.focus();
      }

      return () => {
        restoreFocusRef.current?.focus?.();
      };
    }, [mounted, open]);

    React.useEffect(() => {
      if (!mounted || !open) {
        return undefined;
      }

      return lockBodyScroll();
    }, [mounted, open]);

    React.useEffect(() => {
      if (!mounted || !open) {
        return undefined;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape") {
          return;
        }

        onEscapeKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (dismissOnEscape) {
          event.preventDefault();
          requestClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [dismissOnEscape, mounted, onEscapeKeyDown, open, requestClose]);

    React.useEffect(() => {
      if (!mounted || !open) {
        return undefined;
      }

      const surface = surfaceRef.current;
      if (!surface) {
        return undefined;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") {
          return;
        }

        const tabbables = getTabbableElements(surface);
        if (tabbables.length === 0) {
          event.preventDefault();
          surface.focus();
          return;
        }

        const first = tabbables[0];
        const last = tabbables[tabbables.length - 1];
        const activeElement = document.activeElement;

        if (
          !(activeElement instanceof HTMLElement) ||
          !surface.contains(activeElement)
        ) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
          return;
        }

        if (event.shiftKey && activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [mounted, open]);

    if (!mounted) {
      return null;
    }

    return (
      <DrawerPortal container={container} mounted={mounted}>
        <div className={styles.viewport} data-slot="drawer-portal">
          <DrawerOverlay
            data-state={state}
            onMouseDown={handleBackdropClick}
            transition={transition}
          />
          <div
            ref={setSurfaceRef}
            aria-describedby={describedby}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? undefined : labelledby}
            aria-modal="true"
            className={cn(contentClassName({ size }), className)}
            data-show-close={showClose ? "" : undefined}
            data-side={side}
            data-size={size}
            data-slot="drawer-content"
            data-state={state}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            style={contentStyle}
            tabIndex={-1}
            {...props}
          >
            {showClose ? <DrawerClose className={styles.close} /> : null}
            {children}
          </div>
        </div>
      </DrawerPortal>
    );
  }
);

DrawerContent.displayName = "DrawerContent";

export type DrawerHeaderProps = React.HTMLAttributes<HTMLElement>;

export const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => (
  <header
    className={cn(styles.header, className)}
    data-slot="drawer-header"
    {...props}
  />
);

DrawerHeader.displayName = "DrawerHeader";

export type DrawerTitleProps = React.ComponentPropsWithoutRef<
  typeof Typography
>;

export const DrawerTitle = React.forwardRef<HTMLElement, DrawerTitleProps>(
  ({ children, className, id, variant = "title-sm", ...props }, ref) => {
    const { setTitlePresent, titleId } = useDrawerContext("DrawerTitle");

    React.useEffect(() => {
      setTitlePresent(true);
      return () => setTitlePresent(false);
    }, [setTitlePresent]);

    return (
      <Typography
        ref={ref}
        className={cn(styles.title, className)}
        component="h2"
        data-slot="drawer-title"
        id={id ?? titleId}
        variant={variant}
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

DrawerTitle.displayName = "DrawerTitle";

export type DrawerDescriptionProps = React.ComponentPropsWithoutRef<
  typeof Typography
>;

export const DrawerDescription = React.forwardRef<
  HTMLElement,
  DrawerDescriptionProps
>(({ children, className, id, variant = "body-sm", ...props }, ref) => {
  const { descriptionId, setDescriptionPresent } =
    useDrawerContext("DrawerDescription");

  React.useEffect(() => {
    setDescriptionPresent(true);
    return () => setDescriptionPresent(false);
  }, [setDescriptionPresent]);

  return (
    <Typography
      ref={ref}
      className={cn(styles.description, className)}
      component="p"
      data-slot="drawer-description"
      id={id ?? descriptionId}
      variant={variant}
      {...props}
    >
      {children}
    </Typography>
  );
});

DrawerDescription.displayName = "DrawerDescription";

export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerBody = ({ className, ...props }: DrawerBodyProps) => (
  <div
    className={cn(styles.body, className)}
    data-slot="drawer-body"
    {...props}
  />
);

DrawerBody.displayName = "DrawerBody";

export type DrawerFooterProps = React.HTMLAttributes<HTMLElement>;

export const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => (
  <footer
    className={cn(styles.footer, className)}
    data-slot="drawer-footer"
    {...props}
  />
);

DrawerFooter.displayName = "DrawerFooter";

export type DrawerCloseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "color"
> & {
  asChild?: boolean;
  children?: React.ReactNode;
  color?: React.ComponentProps<typeof IconButton>["color"];
  /** Accessible name for the icon close control. Defaults to `"Close"`. */
  label?: string;
  size?: React.ComponentProps<typeof IconButton>["size"];
  variant?: React.ComponentProps<typeof IconButton>["variant"];
};

export const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  DrawerCloseProps
>(
  (
    {
      asChild = false,
      children,
      className,
      color = "neutral",
      label = "Close",
      onClick,
      size = "md",
      type = "button",
      variant = "ghost",
      ...props
    },
    ref
  ) => {
    const { setOpen } = useDrawerContext("DrawerClose");

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        setOpen(false);
      }
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        onClick?: React.MouseEventHandler;
        ref?: React.Ref<HTMLButtonElement>;
      }>;

      return React.cloneElement(child, {
        ...(props as Partial<typeof child.props>),
        "data-slot": "drawer-close",
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(event);
          handleClick(event);
        },
        ref: composeRefs(ref, child.props.ref),
      } as Partial<typeof child.props>);
    }

    return (
      <IconButton
        ref={ref}
        className={className}
        color={color}
        data-slot="drawer-close"
        icon={<Icon name="close" />}
        label={label}
        onClick={handleClick}
        size={size}
        type={type}
        variant={variant}
        {...props}
      />
    );
  }
);

DrawerClose.displayName = "DrawerClose";
