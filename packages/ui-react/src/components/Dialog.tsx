import * as React from "react";
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
   * Focus trapping and returning focus to the trigger are intentionally OUT OF
   * SCOPE for this source-only, dependency-free component. Manage focus in the
   * consuming application (e.g. focus the trigger again after `open` flips to
   * `false`).
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

    if (!open) {
      return null;
    }

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (dismissOnBackdrop && event.target === event.currentTarget) {
        onClose?.();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (dismissOnEscape && event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
      }
    };

    return (
      <div className="if-dialog__backdrop" onClick={handleBackdropClick} onKeyDown={handleKeyDown}>
        <div
          ref={ref}
          role="dialog"
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
      </div>
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
