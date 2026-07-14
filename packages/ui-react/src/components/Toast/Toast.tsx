import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import styles from "./Toast.module.css";

export type ToastPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

export type ToastCloseReason = "closeClick" | "escapeKeyDown" | "timeout";

export type ToastTransition = {
  /** Enter animation duration in milliseconds. Defaults to 220. */
  enter?: number;
  /** Exit animation duration in milliseconds. Defaults to 180. */
  out?: number;
};

type ToastStyle = React.CSSProperties & {
  "--nova-toast-enter-duration"?: string;
  "--nova-toast-out-duration"?: string;
};

export type ToastProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "title"
> & {
  /** Trailing action slot, such as an undo button or a link. */
  action?: React.ReactNode;
  /** Milliseconds before `onClose` is called with `reason="timeout"`. Pass `null` to disable auto-dismiss. */
  autoHideDuration: number | null;
  /** Accessible label for the dismiss button. Defaults to `"Dismiss notification"`. */
  closeLabel?: string;
  /** Custom toast body. When set, `message` and `title` are ignored. Use `Alert` for severity styling. */
  children?: React.ReactNode;
  /** When false, pauses the auto-hide timer while the window is blurred. Defaults to false. */
  disableWindowBlurListener?: boolean;
  /** When false, Escape does not dismiss the toast. Defaults to true. */
  dismissOnEscape?: boolean;
  /** Hides the built-in dismiss button. */
  hideCloseButton?: boolean;
  /** Primary message body. */
  message?: React.ReactNode;
  /** Callback fired when the toast requests to close. */
  onClose: (
    event: Event | React.SyntheticEvent,
    reason: ToastCloseReason
  ) => void;
  /** Controls toast visibility. */
  open: boolean;
  /** Fixed corner placement on the viewport. */
  position: ToastPosition;
  /** Milliseconds to wait before dismissing after pointer leave when the timer was paused. Defaults to half of `autoHideDuration`. */
  resumeHideDuration?: number;
  /** Bold lead line shown above the message body. */
  title?: React.ReactNode;
  /** Enter and exit animation durations in milliseconds. */
  transition?: ToastTransition;
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      action,
      autoHideDuration,
      children,
      className,
      closeLabel = "Dismiss notification",
      disableWindowBlurListener = false,
      dismissOnEscape = true,
      hideCloseButton = false,
      message,
      onClose,
      open,
      position,
      resumeHideDuration,
      style,
      title,
      transition,
      ...props
    },
    ref
  ) => {
    const surfaceRef = React.useRef<HTMLDivElement | null>(null);
    const hideTimerRef = React.useRef<number | null>(null);
    const resumeTimerRef = React.useRef<number | null>(null);
    const remainingDurationRef = React.useRef<number | null>(null);
    const hideStartedAtRef = React.useRef<number | null>(null);
    const [mounted, setMounted] = React.useState(open);
    const [exiting, setExiting] = React.useState(false);
    const usesCustomContent = children != null;

    const clearHideTimer = React.useCallback(() => {
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }, []);

    const clearResumeTimer = React.useCallback(() => {
      if (resumeTimerRef.current != null) {
        window.clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = null;
      }
    }, []);

    const requestClose = React.useCallback(
      (event: Event | React.SyntheticEvent, reason: ToastCloseReason) => {
        onClose(event, reason);
      },
      [onClose]
    );

    const startHideTimer = React.useCallback(
      (duration: number) => {
        clearHideTimer();
        remainingDurationRef.current = duration;
        hideStartedAtRef.current = Date.now();
        hideTimerRef.current = window.setTimeout(() => {
          requestClose(new Event("timeout"), "timeout");
        }, duration);
      },
      [clearHideTimer, requestClose]
    );

    const pauseHideTimer = React.useCallback(() => {
      if (hideTimerRef.current == null || hideStartedAtRef.current == null) {
        return;
      }

      const elapsed = Date.now() - hideStartedAtRef.current;
      const remaining = Math.max(
        (remainingDurationRef.current ?? 0) - elapsed,
        0
      );

      remainingDurationRef.current = remaining;
      clearHideTimer();
    }, [clearHideTimer]);

    const resumeHideTimer = React.useCallback(() => {
      if (autoHideDuration == null || remainingDurationRef.current == null) {
        return;
      }

      const delay =
        resumeHideDuration ??
        Math.max(
          Math.floor((remainingDurationRef.current || autoHideDuration) / 2),
          0
        );

      clearResumeTimer();
      resumeTimerRef.current = window.setTimeout(() => {
        startHideTimer(remainingDurationRef.current ?? autoHideDuration);
      }, delay);
    }, [
      autoHideDuration,
      clearResumeTimer,
      resumeHideDuration,
      startHideTimer,
    ]);

    React.useEffect(() => {
      if (open) {
        setMounted(true);
        setExiting(false);
        return;
      }

      if (!mounted) {
        return;
      }

      setExiting(true);
      const outDuration = transition?.out ?? 180;
      const timer = window.setTimeout(() => {
        setMounted(false);
        setExiting(false);
      }, outDuration);

      return () => window.clearTimeout(timer);
    }, [mounted, open, transition?.out]);

    React.useEffect(() => {
      clearHideTimer();
      clearResumeTimer();
      remainingDurationRef.current = null;
      hideStartedAtRef.current = null;

      if (!open || autoHideDuration == null) {
        return;
      }

      startHideTimer(autoHideDuration);

      return () => {
        clearHideTimer();
        clearResumeTimer();
      };
    }, [
      autoHideDuration,
      clearHideTimer,
      clearResumeTimer,
      open,
      startHideTimer,
    ]);

    React.useEffect(() => {
      if (!open || autoHideDuration == null || disableWindowBlurListener) {
        return;
      }

      const handleVisibilityChange = () => {
        if (document.hidden) {
          pauseHideTimer();
          return;
        }

        resumeHideTimer();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
    }, [
      autoHideDuration,
      disableWindowBlurListener,
      open,
      pauseHideTimer,
      resumeHideTimer,
    ]);

    React.useEffect(() => {
      if (!open || !dismissOnEscape) {
        return;
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape") {
          return;
        }

        requestClose(event, "escapeKeyDown");
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [dismissOnEscape, open, requestClose]);

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

    if (!mounted) {
      return null;
    }

    const toastStyle: ToastStyle = {
      ...style,
      ...(transition?.enter != null
        ? { "--nova-toast-enter-duration": `${transition.enter}ms` }
        : undefined),
      ...(transition?.out != null
        ? { "--nova-toast-out-duration": `${transition.out}ms` }
        : undefined),
    };

    const content =
      children ??
      (title != null || message != null ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          className={styles.body}
          role="status"
        >
          {title != null ? (
            <strong className={styles.title}>{title}</strong>
          ) : null}
          {message != null ? <p className={styles.message}>{message}</p> : null}
        </div>
      ) : null);

    return createPortal(
      <div className={styles.viewport} data-position={position}>
        <div
          ref={setSurfaceRef}
          className={cn(
            styles.root,
            usesCustomContent && styles.rootComposed,
            className
          )}
          data-position={position}
          data-show-close={hideCloseButton ? undefined : ""}
          data-state={exiting ? "closed" : "open"}
          onPointerEnter={autoHideDuration != null ? pauseHideTimer : undefined}
          onPointerLeave={
            autoHideDuration != null ? resumeHideTimer : undefined
          }
          role="presentation"
          style={toastStyle}
          {...props}
        >
          {!hideCloseButton ? (
            <IconButton
              className={styles.dismiss}
              variant="ghost"
              size="sm"
              color="neutral"
              onClick={(event) => requestClose(event, "closeClick")}
              aria-label={closeLabel}
              icon={<Icon name="close" />}
              label={closeLabel}
            />
          ) : null}
          <div className={styles.header}>
            {content ? <div className={styles.content}>{content}</div> : null}
          </div>
          {action ? <div className={styles.action}>{action}</div> : null}
        </div>
      </div>,
      document.body
    );
  }
);

Toast.displayName = "Toast";
