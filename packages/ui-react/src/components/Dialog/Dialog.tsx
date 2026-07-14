import * as React from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/classNames";
import { lockBodyScroll } from "../../utils/lockBodyScroll";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";
import styles from "./Dialog.module.css";

export type DialogSize = "contain" | "sm" | "md" | "lg";

export type DialogTransition = {
  /** Enter animation duration in milliseconds. Defaults to 200. */
  enter?: number;
  /** Exit animation duration in milliseconds. Defaults to 150. */
  out?: number;
};

type DialogContextValue = {
  descriptionId: string;
  descriptionPresent: boolean;
  open: boolean;
  setDescriptionPresent: (present: boolean) => void;
  setOpen: (open: boolean) => void;
  setTitlePresent: (present: boolean) => void;
  size: DialogSize;
  titleId: string;
  titlePresent: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
};

type DialogStyle = React.CSSProperties & {
  "--nova-dialog-enter-duration"?: string;
  "--nova-dialog-out-duration"?: string;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

const contentClassName = cva(styles.content, {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      contain: styles.sizeContain,
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

function useDialogContext(component: string) {
  const context = React.useContext(DialogContext);

  if (!context) {
    throw new Error(`${component} must be used within Dialog.`);
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
    (element) => element.dataset.slot !== "dialog-close"
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

export type DialogProps = {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  /**
   * Convenience callback fired when the dialog requests to close. Prefer
   * `onOpenChange` when you need the next open state explicitly.
   */
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** Surface width preset. Defaults to `md`. */
  size?: DialogSize;
};

export const Dialog = ({
  children,
  defaultOpen = false,
  onClose,
  onOpenChange,
  open,
  size = "md",
}: DialogProps) => {
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
        onClose?.();
      }
    },
    [isControlled, onClose, onOpenChange]
  );

  const contextValue = React.useMemo<DialogContextValue>(
    () => ({
      descriptionId,
      descriptionPresent,
      open: isOpen,
      setDescriptionPresent,
      setOpen,
      setTitlePresent,
      size,
      titleId,
      titlePresent,
      triggerRef,
    }),
    [
      descriptionId,
      descriptionPresent,
      isOpen,
      setOpen,
      size,
      titleId,
      titlePresent,
    ]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      <div data-slot="dialog">{children}</div>
    </DialogContext.Provider>
  );
};

Dialog.displayName = "Dialog";

export type DialogTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ asChild = false, children, onClick, type = "button", ...props }, ref) => {
  const { setOpen, triggerRef } = useDialogContext("DialogTrigger");

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
      "data-slot": "dialog-trigger",
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
      data-slot="dialog-trigger"
      onClick={handleClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});

DialogTrigger.displayName = "DialogTrigger";

export type DialogPortalProps = {
  children?: React.ReactNode;
  container?: HTMLElement | null;
  /** When `false`, nothing is portaled. Used for exit animations. */
  mounted?: boolean;
};

export const DialogPortal = ({
  children,
  container,
  mounted = true,
}: DialogPortalProps) => {
  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, container ?? document.body);
};

DialogPortal.displayName = "DialogPortal";

export type DialogOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  transition?: DialogTransition;
};

export const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  DialogOverlayProps
>(({ className, style, transition, ...props }, ref) => {
  const overlayStyle: DialogStyle = {
    "--nova-dialog-enter-duration": `${transition?.enter ?? 200}ms`,
    "--nova-dialog-out-duration": `${transition?.out ?? 150}ms`,
    ...style,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(styles.overlay, className)}
      data-slot="dialog-overlay"
      style={overlayStyle}
      {...props}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";

export type DialogOpenAutoFocusEvent = {
  preventDefault: () => void;
};

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Portal mount target. Defaults to `document.body`. */
  container?: HTMLElement | null;
  /** When `false`, clicking the backdrop does not close the dialog. */
  dismissOnBackdrop?: boolean;
  /** When `false`, pressing Escape does not close the dialog. */
  dismissOnEscape?: boolean;
  onBackdropClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  role?: "alertdialog" | "dialog";
  /** Renders `DialogClose` in the top-end corner. Defaults to `true`. */
  showClose?: boolean;
  /** Surface width override. */
  size?: DialogSize;
  /** Enter and exit animation durations in milliseconds. */
  transition?: DialogTransition;
};

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
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
      role = "dialog",
      showClose = true,
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
      size: contextSize,
      titleId,
      titlePresent,
    } = useDialogContext("DialogContent");
    const size = sizeProp ?? contextSize;
    const outDuration = transition?.out ?? 150;
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

    const contentStyle: DialogStyle = {
      "--nova-dialog-enter-duration": `${transition?.enter ?? 200}ms`,
      "--nova-dialog-out-duration": `${outDuration}ms`,
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
      <DialogPortal container={container} mounted={mounted}>
        <div className={styles.viewport} data-slot="dialog-portal">
          <DialogOverlay
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
            data-size={size}
            data-slot="dialog-content"
            data-state={state}
            onMouseDown={(event) => event.stopPropagation()}
            role={role}
            style={contentStyle}
            tabIndex={-1}
            {...props}
          >
            {showClose ? <DialogClose className={styles.close} /> : null}
            {children}
          </div>
        </div>
      </DialogPortal>
    );
  }
);

DialogContent.displayName = "DialogContent";

export type DialogHeaderProps = React.HTMLAttributes<HTMLElement>;

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <header
    className={cn(styles.header, className)}
    data-slot="dialog-header"
    {...props}
  />
);

DialogHeader.displayName = "DialogHeader";

export type DialogTitleProps = React.ComponentPropsWithoutRef<
  typeof Typography
>;

export const DialogTitle = React.forwardRef<HTMLElement, DialogTitleProps>(
  ({ children, className, id, variant = "title-md", ...props }, ref) => {
    const { setTitlePresent, titleId } = useDialogContext("DialogTitle");

    React.useEffect(() => {
      setTitlePresent(true);
      return () => setTitlePresent(false);
    }, [setTitlePresent]);

    return (
      <Typography
        ref={ref}
        className={cn(styles.title, className)}
        component="h2"
        data-slot="dialog-title"
        id={id ?? titleId}
        variant={variant}
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof Typography
>;

export const DialogDescription = React.forwardRef<
  HTMLElement,
  DialogDescriptionProps
>(({ children, className, id, variant = "body-md", ...props }, ref) => {
  const { descriptionId, setDescriptionPresent } =
    useDialogContext("DialogDescription");

  React.useEffect(() => {
    setDescriptionPresent(true);
    return () => setDescriptionPresent(false);
  }, [setDescriptionPresent]);

  return (
    <Typography
      ref={ref}
      className={cn(styles.description, className)}
      component="p"
      data-slot="dialog-description"
      id={id ?? descriptionId}
      variant={variant}
      {...props}
    >
      {children}
    </Typography>
  );
});

DialogDescription.displayName = "DialogDescription";

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogBody = ({ className, ...props }: DialogBodyProps) => (
  <div
    className={cn(styles.body, className)}
    data-slot="dialog-body"
    {...props}
  />
);

DialogBody.displayName = "DialogBody";

export type DialogFooterProps = React.HTMLAttributes<HTMLElement>;

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => (
  <footer
    className={cn(styles.footer, className)}
    data-slot="dialog-footer"
    {...props}
  />
);

DialogFooter.displayName = "DialogFooter";

export type DialogCloseProps = Omit<
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

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  DialogCloseProps
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
    const { setOpen } = useDialogContext("DialogClose");

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
        "data-slot": "dialog-close",
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
        data-slot="dialog-close"
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

DialogClose.displayName = "DialogClose";
