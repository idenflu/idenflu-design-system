import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/classNames";
import { lockBodyScroll } from "../../utils/lockBodyScroll";
import {
  DrawerContext,
  type DrawerContextValue,
  type DrawerSide,
  type DrawerSize,
  type DrawerTransition,
} from "./DrawerContext";
import {
  getInitialFocusTarget,
  getTabbableElements,
  usePresence,
} from "./Drawer.utils";
import { DrawerPortal } from "./DrawerPortal";
import { DrawerOverlay } from "./DrawerOverlay";
import { DrawerHeader } from "./DrawerHeader";
import { DrawerBody } from "./DrawerBody";
import { DrawerFooter } from "./DrawerFooter";
import { DrawerClose } from "./DrawerClose";
import closeStyles from "./DrawerClose.module.css";
import styles from "./Drawer.module.css";

type DrawerStyle = React.CSSProperties & {
  "--nova-drawer-enter-duration"?: string;
  "--nova-drawer-out-duration"?: string;
};

const contentClassName = cva(styles.content, {
  defaultVariants: { size: "md" },
  variants: {
    size: { lg: styles.sizeLg, md: styles.sizeMd, sm: styles.sizeSm },
  },
});

export type DrawerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onClose"
> & {
  /** Portal mount target. Defaults to `document.body`. */
  container?: HTMLElement | null;
  defaultOpen?: boolean;
  /** When `false`, clicking the backdrop does not close the drawer. */
  dismissOnBackdrop?: boolean;
  /** When `false`, pressing Escape does not close the drawer. */
  dismissOnEscape?: boolean;
  onBackdropClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Callback fired when the drawer requests to close. */
  onClose: () => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** Renders `Drawer.Close` in the top-end corner. Defaults to `true`. */
  showClose?: boolean;
  /** Edge from which the drawer panel slides in. */
  side: DrawerSide;
  /** Panel width preset for left/right drawers. Defaults to `md`. */
  size?: DrawerSize;
  /** Enter and exit animation durations in milliseconds. */
  transition?: DrawerTransition;
};

const DrawerRoot = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      "aria-describedby": ariaDescribedbyProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledbyProp,
      children,
      className,
      container,
      defaultOpen = false,
      dismissOnBackdrop = true,
      dismissOnEscape = true,
      onBackdropClick,
      onClose,
      onEscapeKeyDown,
      onOpenChange,
      open: controlledOpen,
      showClose = true,
      side,
      size = "md",
      style,
      transition,
      ...props
    },
    ref,
  ) => {
    const titleId = React.useId();
    const descriptionId = React.useId();
    const isControlled = controlledOpen !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = controlledOpen ?? uncontrolledOpen;
    const [titlePresent, setTitlePresent] = React.useState(false);
    const [descriptionPresent, setDescriptionPresent] = React.useState(false);

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) setUncontrolledOpen(nextOpen);
        onOpenChange?.(nextOpen);
        if (!nextOpen) onClose();
      },
      [isControlled, onClose, onOpenChange],
    );

    const contextValue = React.useMemo<DrawerContextValue>(
      () => ({
        descriptionId,
        descriptionPresent,
        setDescriptionPresent,
        setOpen,
        setTitlePresent,
        titleId,
        titlePresent,
      }),
      [descriptionId, descriptionPresent, setOpen, titleId, titlePresent],
    );

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
      [ref],
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
      <DrawerContext.Provider value={contextValue}>
        <DrawerPortal container={container} mounted={mounted}>
          <div className={styles.viewport}>
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
              data-state={state}
              onMouseDown={(event) => event.stopPropagation()}
              role="dialog"
              style={contentStyle}
              tabIndex={-1}
              {...props}
            >
              {showClose ? <DrawerClose className={closeStyles.close} /> : null}
              {children}
            </div>
          </div>
        </DrawerPortal>
      </DrawerContext.Provider>
    );
  },
);

DrawerRoot.displayName = "Drawer";

export const Drawer = Object.assign(DrawerRoot, {
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
});

export type { DrawerSide, DrawerSize, DrawerTransition } from "./DrawerContext";
