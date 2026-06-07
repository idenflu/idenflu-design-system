import * as React from "react";
import { createPortal } from "react-dom";
import { classNames } from "../utils/classNames";

export type DialogSize = "small" | "medium" | "large";

export type DialogProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Controls visibility. When `false` the component renders nothing. */
  open: boolean;
  /**
   * Requested-close callback fired by the backdrop, the Escape key, and the
   * built-in close button. The dialog is fully controlled: closing the surface
   * is the consumer's responsibility (flip `open` in response to this).
   *
   * On open the surface receives focus; on close focus returns to the element
   * that was focused before opening. A full focus trap (cycling Tab within the
   * surface) is left to the consuming application.
   */
  onClose?: () => void;
  /** Surface width preset. */
  size?: DialogSize;
  /**
   * Convenience title. When provided, a header with an `<h2>` is rendered and
   * wired to the dialog via `aria-labelledby`. For full control compose
   * `DialogHeader` / `DialogTitle`-style markup yourself and pass
   * `aria-labelledby` instead.
   */
  title?: React.ReactNode;
  /**
   * Accessible name used when there is no visible title to reference. Ignored
   * when `title` or `aria-labelledby` is supplied.
   */
  label?: string;
  /** Accessible name for the built-in close button. */
  closeLabel?: string;
  /** Suppress the built-in close button rendered alongside `title`. */
  hideClose?: boolean;
  /** When `false`, clicking the backdrop does not request close. */
  dismissOnBackdrop?: boolean;
  /** When `false`, pressing Escape does not request close. */
  dismissOnEscape?: boolean;
};

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      size = "medium",
      title,
      label,
      closeLabel = "Close",
      hideClose = false,
      dismissOnBackdrop = true,
      dismissOnEscape = true,
      className,
      children,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const generatedTitleId = React.useId();
    const titleId = title != null ? generatedTitleId : undefined;
    const labelledby = ariaLabelledby ?? titleId;

    const surfaceRef = React.useRef<HTMLDivElement | null>(null);
    const restoreFocusRef = React.useRef<HTMLElement | null>(null);

    const setSurfaceRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        surfaceRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Escape closes regardless of where focus sits (document-level), mirroring Drawer.
    React.useEffect(() => {
      if (!open || !dismissOnEscape) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose?.();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, dismissOnEscape, onClose]);

    // Move focus into the surface on open and restore it to the trigger on close.
    React.useEffect(() => {
      if (!open) return;
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      surfaceRef.current?.focus();
      return () => restoreFocusRef.current?.focus?.();
    }, [open]);

    // Lock body scroll while the dialog is open.
    React.useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }, [open]);

    if (!open) {
      return null;
    }

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (dismissOnBackdrop && event.target === event.currentTarget) {
        onClose?.();
      }
    };

    return createPortal(
      <div className="if-dialog__backdrop" onClick={handleBackdropClick}>
        <div
          ref={setSurfaceRef}
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-label={labelledby ? undefined : label}
          aria-labelledby={labelledby}
          className={classNames("if-dialog", `if-dialog--${size}`, className)}
          {...props}
        >
          {title != null ? (
            <header className="if-dialog__header">
              <h2 id={titleId} className="if-dialog__title">
                {title}
              </h2>
              {!hideClose && onClose ? <DialogClose label={closeLabel} onClick={onClose} /> : null}
            </header>
          ) : null}
          {children}
        </div>
      </div>,
      document.body,
    );
  },
);

Dialog.displayName = "Dialog";

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <header className={classNames("if-dialog__header", className)} {...props} />
);

export const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames("if-dialog__body", className)} {...props} />
);

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <footer className={classNames("if-dialog__footer", className)} {...props} />
);

export type DialogCloseProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** Required accessible name for this icon-only control. */
  label?: string;
};

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, label = "Close", type = "button", ...props }, ref) => (
    <button ref={ref} aria-label={label} className={classNames("if-dialog__close", className)} type={type} {...props}>
      <span className="if-button__icon" aria-hidden="true">
        &#215;
      </span>
    </button>
  ),
);

DialogClose.displayName = "DialogClose";
